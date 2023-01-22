// Some characters are not treated well in Bash, so we sanitize them
// For example, the use of ` will break the workflow if you try to print it
export function sanitazeString(value: string) {
    let trimmed = value.trim();
    const bashChars = ["`", "$"];
    return bashChars.reduce((acc, char) => acc.replace(char, ""), trimmed).trim();
}