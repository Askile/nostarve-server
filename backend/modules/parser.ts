export default class Parser {
    public static tryParseJSON(str: string) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return null;
        }
    }
}