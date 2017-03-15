
## Dataloader API
Following examples assume `<API_PORT>==32799`

### POST /submitData

This is a multipart post request with fields:
* `case_id`: Identified of the image
* `upload`: Image file path

Example:

`curl -v -F case_id=TCGA-02-0001 -F upload=@TCGA-02-0001-01Z-00-DX1.83fce43e-42ac-4dcd-b156-2908e75f2e47.svs http://localhost:32799/submitData`

Return type: `json`
On success returns: `{"status":"success"}`

### GET /subjectIdExists
`curl localhost:32799/subjectIdExists?SubjectUID=TCGA-02-0001`
Returns an array with subjectID and file path.
Empty array if subject Id doesnt exist

### GET /getMD5ForImage
`curl localhost:32799/getMD5ForImage?imageFileName=TCGA-02-0001-01Z-00-DX1.83fce43e-42ac-4dcd-b156-2908e75f2e47.svs`
Returns an array with MD5 of the image
`[{"md5sum":"418a0724b0a2113bcd2956bacae105b7"}]` 
