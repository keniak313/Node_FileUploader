import asyncHandler from "express-async-handler";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";
import uploadHandler from "../uploadConfig.js";
import { removeAsset, updateAsset } from "../uploadConfig.js";

import * as db from "../db/queries.js";

export const indexGet = asyncHandler(async (req, res) => {
  if (req.user) {
    const mainFolder = await db.Folders().getMainFolder(Number(req.user.id));
    res.redirect(`/folders/${mainFolder[0].id}`);
    //res.render("index", { folders: mainFolder });
  } else {
    res.render("index");
  }
});

export const newFolderGet = asyncHandler(async (req, res) => {
  res.render("new-folder-form", { parent: null });
});

export const newFolderPost = asyncHandler(async (req, res) => {
  await db.Folders().createFolder(req.body.name, Number(req.user.id));
  res.redirect("/");
});

export const newChildGet = asyncHandler(async (req, res) => {
  const parentId = Number(req.params.id);
  const parent = await db
    .Folders()
    .getFolderById(parentId, Number(req.user.id));
  res.render("new-folder-form", { parent: parent[0] });
});

export const newChildPost = asyncHandler(async (req, res) => {
  await db
    .Folders()
    .createChildFolder(
      Number(req.params.id),
      req.body.name,
      Number(req.user.id),
    );
  res.redirect(`/folders/${req.params.id}`);
});

export const openFolderGet = asyncHandler(async (req, res) => {
  const folders = await db
    .Folders()
    .getFolderById(Number(req.params.id), Number(req.user.id));
  if (folders.length > 0) {
    res.render("folders", { isMain: false, isShared: false, folders: folders });
  } else {
    throw new CustomNotFoundError("Not Found")
  }
});

//UPLOAD FILE

export const uploadGet = asyncHandler(async (req, res) => {
  res.render("upload-form", { id: req.params.id });
});

export const uploadPost = asyncHandler(async (req, res) => {
  const cloudAsset = await uploadHandler(req, res);
  console.log("Result");
  console.log(cloudAsset);
  await db
    .Files()
    .uploadFile(
      cloudAsset.url,
      cloudAsset.display_name,
      cloudAsset.format,
      cloudAsset.public_id,
      Number(req.user.id),
      Number(req.params.id),
    );
  res.redirect(`/folders/${req.params.id}`);
});

export const previewGet = async (req, res) => {
  const file = await db.Files().getFileById(Number(req.params.fileId));
  let isShared = false;
  if (req.params.shareId) {
    isShared = true;
  }
  res.render("file-preview", { isShared: isShared, file: file[0] });
};

export const removeFileGet = asyncHandler(async (req, res) => {
  const folderId = Number(req.params.folderId);
  const userId = Number(req.user.id);
  const fileId = Number(req.params.fileId);
  const file = await db.Files().getFileById(fileId);
  const publicId = file[0].publicId;
  await removeAsset(publicId, db.Files().removeFileById(fileId, userId));
  res.redirect(`/folders/${folderId}`);
  //res.send(req.params);
});

export const editFileGet = asyncHandler(async (req, res) => {
  const folders = await db.Folders().getFolders(Number(req.user.id));
  const file = await db.Files().getFileById(Number(req.params.fileId));
  res.render("file-edit-form", { folders: folders, file: file[0] });
});

export const editFilePost = asyncHandler(async (req, res) => {
  const file = await db.Files().getFileById(Number(req.params.fileId));
  const publicId = file[0].publicId;
  await updateAsset(
    publicId,
    req.body.name,
    db
      .Files()
      .updateFileById(
        Number(req.params.fileId),
        Number(req.user.id),
        req.body.name,
        Number(req.body.folder),
      ),
  );
  res.redirect(`/folders/${req.body.folder}`);
});

export const shareCreateGet = asyncHandler(async (req, res) => {
  await db
    .Folders()
    .createShareLink(
      Number(req.user.id),
      Number(req.params.folderId),
      req.params.shareId,
    );
  res.redirect(`/folders/${req.params.folderId}`);
});

export const shareGet = asyncHandler(async (req, res) => {
  const folder = await db.Folders().getShareLink(req.params.shareId);
  if(folder.length > 0){
    res.render(`folders`, { isMain: true, isShared: true, folders: folder });
  }else{
    throw new CustomNotFoundError("Not Found")
  }
});
