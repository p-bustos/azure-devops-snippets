/* GetPreviousBuildNumber.js

Date:           2022-10
Author:         Patricio B.
Description:    The following program is used to determine the buildnumber of the previous pipeline run for a specific pipeline on a specific branch, 
                the output of this program is used by azure pipelines to populate a variable that can be used in other stages/jobs
Usage:          To use this script in an azure pipeline it must be executed in a bash job as shown in the example below, using the echo and ##vso funcionslity the output of the script is stored in a job output variable

    - bash: |
        echo "##vso[task.setvariable variable=BuildNumber;isOutput=true]$(node _infrastructure/azure-pipelines/scripts/GetPreviousBuildNumber.js)"
      name: PreviousBuild
      env:
        API_TOKEN: '{YOUR_TOKEN}'
        ORGANIZATION: '{YOUR_ORGANIZATION}'

*/

async function getPreviousBuilds () {
    const https = require('https');

    //PAT Token generated in azure devops UI, the leading : is very required for the API call to authenticate properly
    const token = Buffer.from(':' + process.env.API_TOKEN).toString('base64') // Encoding PAT to base64 is required for API calls
   
    let json = '';

    const options = {
        hostname: 'dev.azure.com',
        port: 443,
        path:  process.env.ORGANIZATION + '/_apis/build/builds?definitions=' + process.env.SYSTEM_DEFINITIONID + '&branchName=' + process.env.BUILD_SOURCEBRANCH + '&statusFilter=completed&resultFilter=succeeded&maxBuildsPerDefinition=1&queryOrder=finishTimeDescending&api-version=6.1',
        method: 'GET',
        headers: {
            Authorization: `Basic ${token}`
        }
      };


    https.get(options,(resp) => {
        let chunks = [];
        resp.on('data', (d) => {
            chunks.push(d);
        }).on('end', () => {
            let data   = Buffer.concat(chunks);
            json = JSON.parse(data);
            console.log((json.value[0].buildNumber).trim());
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

getPreviousBuilds()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
