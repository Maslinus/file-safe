import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {

  const user = await ctx.db
  .query("users")
  .withIndex('by_tokenIdentifier', (q) =>
    q.eq("tokenIdentifier", tokenIdentifier))
  .first()

  if(!user){
    throw new ConvexError("expected user to be defind")
  }

  return user;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    // name: v.string(),
    // image: v.string()
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      // name: args.name,
      // image: args.image,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { 
    tokenIdentifier: v.string(),
    orgId: v.string(),
    // role: roles
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      // tokenIdentifier: args.tokenIdentifier,
      orgIds: [...user.orgIds, { orgId: args.orgId}],
    });
  },
});