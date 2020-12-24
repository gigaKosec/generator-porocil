import storage_dummy from "./storage_alter";
if (nastavitev === "storeToLocalJSON"){
  import {loadDays, storeDays} from storage_dummy;
}
else {
  import {loadDays, storeDays} from localStorage;   //from storageOnServer
}

export default {
  loadDays,
  storeDays
}