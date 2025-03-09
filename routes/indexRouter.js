import { Router } from "express";

export const indexRouter = Router();
import * as indexController from "../controllers/indexController.js";

indexRouter.get("/", indexController.indexGet);
indexRouter.get('/new-folder', indexController.newFolderGet)
indexRouter.post('/new-folder', indexController.newFolderPost)

indexRouter.get('/new-folder/:id', indexController.newChildGet);
indexRouter.post('/new-folder/:id', indexController.newChildPost);

indexRouter.get('/folders/:id', indexController.openFolderGet)

indexRouter.get('/upload/:id', indexController.uploadGet)
indexRouter.post('/upload/:id', indexController.uploadPost)

indexRouter.get('/folders/:folderId/files/:fileId', indexController.previewGet)

indexRouter.get('/folders/:folderId/files/:fileId/edit-file', indexController.editFileGet) 
indexRouter.post('/folders/:folderId/files/:fileId/edit-file', indexController.editFilePost)

indexRouter.get('/folders/:folderId/files/:fileId/remove-file', indexController.removeFileGet) 

//Share
indexRouter.get('/folders/:folderId/shareCreate/:shareId', indexController.shareCreateGet)
indexRouter.get('/share/:shareId', indexController.shareGet)

indexRouter.get('/share/:shareId/files/:fileId', indexController.previewGet)
