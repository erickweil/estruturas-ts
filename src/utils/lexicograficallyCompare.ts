// A ideia é re-implementar o compartamento padrão do Array.sort

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 * If compareFn is not supplied, all non-undefined array elements are sorted by converting them to strings and comparing strings in UTF-16 code units order. For example, "banana" comes before "cherry". In a numeric sort, 9 comes before 80, but because numbers are converted to strings, "80" comes before "9" in the Unicode order. All undefined elements are sorted to the end of the array.
 * The sort() method preserves empty slots. If the source array is sparse, the empty slots are moved to the end of the array, and always come after all the undefined.
 */
export const lexicograficallyCompare = (a: unknown, b: unknown) => {
    if(a === undefined && b === undefined) return 0;
    if(a === undefined) return 1;
    if(b === undefined) return -1;
    
    let strA = String(a);
    let strB = String(b);
    if(strA < strB) return -1;
    if(strA > strB) return 1;
    return 0;
};