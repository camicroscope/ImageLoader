
var dataLoader_py = process.dataLoader_py || "/home/ganesh/dev/DataLoader_Api/DataLoader/dataLoader/dataloader.py";
var api_key = process.dataloader_api_key || "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";
var api_submit_entry = process.dataloader_api_submit_entry ||  "http://localhost:9099/services/TCGA/GeoJSONMetaData/submit/json";
var image_directory = process.dataLoader_image_directory ||  "/home/ganesh/prod/images";
var api_get_md5_for_image = process.dataloader_api_subject_id_exists || "http://localhost:9099/services/TCGA/GeoJSONMetaData/query/getMD5forImage";
var api_subject_id_exists = process.dataloader_api_subject_id_exists || "http://localhost:9099/services/TCGA/GeoJSONMetaData/query/getImagesForSubjectId";
var port = process.dataloader_port || 3019;

exports.dataLoader_py = dataLoader_py;
exports.api_key = api_key;
exports.api_submit_entry = api_submit_entry;
exports.image_directory = image_directory;
exports.api_get_md5_for_image = api_get_md5_for_image;
exports.api_subject_id_exists = api_subject_id_exists;
exports.port = port;
