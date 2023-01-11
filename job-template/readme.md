# Example usage of template files in Azure DevOps

Template files can help us define reusable logic, this can help reduce overall pipeline file size and simplify the implementation and maintenance of repetitive jobs

Template jobs are defined in their own YAML file and referenced in the YAML file that uses the template



```yaml
# File: main.yml
- job: job_name
  displayName: 'Job Name'
  steps:
    - template: template.yml #template file reference
      parameters:
        parameter1: value1
```
