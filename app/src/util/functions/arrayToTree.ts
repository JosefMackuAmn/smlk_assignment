import { WithIds, WithKids } from "../../types/util/functions/arrayToTree";

// Converts a flat array into an array of trees
const arrayToTree = <T extends WithIds>(array: T[]) => {
    // Variable containing itemId as a key and an item as a value
    const map: { [key: string|number]: WithKids<T> } = {};

    // An array of items with no parentId
    // which will be populated with kid elements
    const roots: WithKids<T>[] = [];

    // Populate map variable
    array.forEach((item) => {
        map[item.itemId] = {
            ...item,
            kids: []
        }
    });

    array.forEach((item) => {
        if (!item.parentId || item.parentId === '0') {
            // Push to roots if this is a top-level item
            roots.push(map[item.itemId]);
        } else {
            // Push kid item into an array of kid items
            // of parent element            
            map[item.parentId].kids.push(item)
        }
    });

    return roots;
}

export { arrayToTree };