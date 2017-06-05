var dataLoader_py = process.env.dataLoader_py || "/root/dataloader/DataLoader/dataLoader/dataloader.py";
var api_key = process.env.dataloader_api_key || "APIKEY";
var bindaas_host = process.env.dataloader_host || "http://dragon.cci.emory.edu:9099";
var api_submit_entry = process.env.dataloader_api_submit_entry ||  bindaas_host+ "/services/Camicroscope_DataLoader/DataLoader/submit/json";
var image_directory = process.env.dataLoader_image_directory ||  "/data/images";
var api_get_md5_for_image = process.env.dataloader_api_subject_id_exists || bindaas_host+ "/services/Camicroscope_DataLoader/DataLoader/query/getMD5forImage";
var api_subject_id_exists = process.env.dataloader_api_subject_id_exists || bindaas_host + "/services/Camicroscope_DataLoader/DataLoader/query/getImagesForSubjectId";
var port = process.env.dataloader_port || 3002;

exports.dataLoader_py = dataLoader_py;
exports.api_key = api_key;
exports.api_submit_entry = api_submit_entry;
exports.image_directory = image_directory;
exports.api_get_md5_for_image = api_get_md5_for_image;
exports.api_subject_id_exists = api_subject_id_exists;
exports.port = port;



