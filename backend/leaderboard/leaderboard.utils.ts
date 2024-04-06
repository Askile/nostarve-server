export default class LeaderboardUtils {
    public static restoreNumber(n: number) {
        if (n >= 1e10) n = n / 1e7 + 60000;
        else if (n >= 1e9) n = n / 1e6 + 50000;
        else if (n >= 1e8) n = n / 1e5 + 40000;
        else if (n >= 1e7) n = n / 1e4 + 30000;
        else if (n >= 1e6) n = n / 1e3 + 20000;
        else if (n >= 1e4) n = n / 1e2 + 10000;

        return n;
    }

    public static simplifyNumber(n: number) {
        if (typeof n !== "number") return "0";
        else if (n >= 1e12) {
            return (n / 1e12).toFixed(2).replace(/\.00$/, '') + "t";
        } else if (n >= 1e9) {
            return (n / 1e9).toFixed(2).replace(/\.00$/, '') + "b";
        } else if (n >= 1e6) {
            return (n / 1e6).toFixed(2).replace(/\.00$/, '') + "m";
        } else if (n >= 1e4) {
            return (n / 1e3).toFixed(1).replace(/\.00$/, '') + "k";
        } else {
            return n.toString();
        }
    }
}