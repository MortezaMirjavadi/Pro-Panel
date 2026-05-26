import type { MenuItem } from "../explorer/types";

/**
 * Recursively filter a menu tree by the user's role.
 * - If an item has no allowedRoles → visible to everyone.
 * - If an item has allowedRoles → only visible if user's role is in the list.
 * - Branch nodes are included only if they have at least one visible child
 *   after filtering (or if they themselves are accessible).
 */
export function filterMenuByRole(
  items: MenuItem[],
  userRole: string | null
): MenuItem[] {
  if (!userRole) return [];

  const result: MenuItem[] = [];

  for (const item of items) {
    // Check if user has access to this item
    const hasAccess =
      !item.allowedRoles || item.allowedRoles.length === 0 || item.allowedRoles.includes(userRole);

    if (item.children) {
      // Recursively filter children
      const filteredChildren = filterMenuByRole(item.children, userRole);

      if (filteredChildren.length > 0) {
        // Branch has visible children — include it (even if the branch itself is restricted,
        // we show it so the user can reach accessible children)
        result.push({ ...item, children: filteredChildren });
      } else if (hasAccess && !item.componentName) {
        // Branch with no children left but user has access — skip (empty category)
      }
    } else if (hasAccess) {
      // Terminal node with access
      result.push(item);
    }
  }

  return result;
}

/**
 * Flatten a filtered menu tree to terminal items only.
 * Same as flattenTerminalItems but operates on already-filtered data.
 */
export function flattenFilteredTerminalItems(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  for (const item of items) {
    if (item.componentName) {
      result.push(item);
    }
    if (item.children) {
      result.push(...flattenFilteredTerminalItems(item.children));
    }
  }
  return result;
}
