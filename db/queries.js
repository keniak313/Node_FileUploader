import { prisma } from "../app.js";

export const User = () => {
  const getUserByEmail = async (email) => {
    const user = await prisma.users.findMany({
      where: {
        email: email,
      },
    });
    console.log(user);
    return user;
  };

  const getUserById = async (id) => {
    const user = await prisma.users.findMany({
      where: {
        id: id,
      },
    });
    return user;
  };

  const createUser = async (email, password, username) => {
    const newUser = await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: password,
      },
    });
    return newUser;
  };

  return { getUserByEmail, getUserById, createUser };
};

export const Folders = () => {
  const createMainFolder = async (userId) => {
    await prisma.folder.create({
      data: {
        name: "MAIN",
        isMain: true,
        userId: userId,
      },
    });
  };

  const getMainFolder = async (userId) => {
    const main = await prisma.folder.findMany({
      where: {
        userId: userId,
        isMain: true,
      },
      include: {
        children: true,
      },
    });
    return main;
  };

  const getFolders = async (userId) => {
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
      },
      include: {
        children: true,
      },
    });
    return folders;
  };

  const getTopFolders = async (userId) => {
    const folders = await prisma.folder.findMany({
      where: {
        parentId: null,
        userId: userId,
        isMain: false,
      },
    });
    return folders;
  };

  const getChildFolders = async (userId) => {
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
        isMain: false,
        NOT: {
          parentId: null,
        },
      },
    });
    return folders;
  };

  const getFolderById = async (id, userId) => {
    const folder = await prisma.folder.findMany({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        children: true,
        parent: true,
        files: true,
      },
    });
    return folder;
  };

  const createFolder = async (name, userId) => {
    await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
      },
    });
  };

  const createChildFolder = async (parentId, name, userId) => {
    await prisma.folder.create({
      data: {
        name: name,
        parentId: parentId,
        userId: userId,
      },
    });
  };

  const createShareLink = async (userId, folderId, shareId) => {
    await prisma.folder.update({
      where: {
        id: folderId,
        userId: userId,
      },
      data: {
        shareId: shareId,
      },
    });
  };

  const getShareLink = async (shareId) =>{
    const folder = await prisma.folder.findMany({
      where:{
        shareId: shareId
      },
      include:{
        children: true,
        files: true,
        user: true
      }
    })
    return folder
  }

  return {
    getMainFolders: getTopFolders,
    getChildFolders,
    getFolders,
    createFolder,
    getFolderById,
    createChildFolder,
    createMainFolder,
    getMainFolder,
    createShareLink,
    getShareLink
  };
};

export const Files = () => {
  const uploadFile = async (url, name, format, publicId, userId, folderId) => {
    await prisma.files.create({
      data: {
        userId: userId,
        folderId: folderId,
        url: url,
        name: name,
        publicId: publicId,
        format: format,
        createdAt: new Date(),
      },
    });
  };

  const getFileById = async (fileId) => {
    const file = await prisma.files.findMany({
      where: {
        id: fileId,
      },
    });
    return file;
  };

  const removeFileById = async (fileId, userId) => {
    await prisma.files.delete({
      where: {
        id: fileId,
        userId: userId,
      },
    });
  };

  const updateFileById = async (fileId, userId, name, folderId) => {
    await prisma.files.update({
      where: {
        id: fileId,
        userId: userId,
      },
      data: {
        name: name,
        folderId: folderId,
      },
    });
  };

  return { uploadFile, getFileById, removeFileById, updateFileById };
};
