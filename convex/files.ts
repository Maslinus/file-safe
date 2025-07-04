"use client";

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFile = mutation({
  args: {
    name: v.string(),
    // fileId: v.id("_storage"),
    orgId: v.string(),
    // type: fileTypes,
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
        throw new ConvexError('you must be lagged in to upload a file')
    }

    await ctx.db.insert("files",{
        name: args.name,
        orgId: args.orgId,
    });
    // const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    // if (!hasAccess) {
    //   throw new ConvexError("you do not have access to this org");
    // }

    // await ctx.db.insert("files", {
    //   name: args.name,
    //   orgId: args.orgId,
    //   fileId: args.fileId,
    //   type: args.type,
    //   userId: hasAccess.user._id,
    // });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    // query: v.optional(v.string()),
    // favorites: v.optional(v.boolean()),
    // deletedOnly: v.optional(v.boolean()),
    // type: v.optional(fileTypes),
  },
  async handler(ctx, args) {

    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
        return [];
    }

    return ctx.db
    .query('files')
    .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
    .collect();
//     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

//     if (!hasAccess) {
//       return [];
//     }

//     let files = await ctx.db
//       .query("files")
//       .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
//       .collect();

//     const query = args.query;

//     if (query) {
//       files = files.filter((file) =>
//         file.name.toLowerCase().includes(query.toLowerCase())
//       );
//     }

//     if (args.favorites) {
//       const favorites = await ctx.db
//         .query("favorites")
//         .withIndex("by_userId_orgId_fileId", (q) =>
//           q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
//         )
//         .collect();

//       files = files.filter((file) =>
//         favorites.some((favorite) => favorite.fileId === file._id)
//       );
//     }

//     if (args.deletedOnly) {
//       files = files.filter((file) => file.shouldDelete);
//     } else {
//       files = files.filter((file) => !file.shouldDelete);
//     }

//     if (args.type) {
//       files = files.filter((file) => file.type === args.type);
//     }

//     const filesWithUrl = await Promise.all(
//       files.map(async (file) => ({
//         ...file,
//         url: await ctx.storage.getUrl(file.fileId),
//       }))
//     );

//     return filesWithUrl;
  },
});