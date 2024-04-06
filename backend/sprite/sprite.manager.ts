import {Image} from "canvas";

export default class SpriteManager {
    public static sprites: Map<string, Image> = new Map<string, Image>();
    public static init() {
        this.sprites.set("body", SpriteManager.createImage("./img/body.png"));
        this.sprites.set("plot", SpriteManager.createImage("./img/plot.png"));
        this.sprites.set("hand", SpriteManager.createImage("./img/hand.png"));
        this.sprites.set("chest", SpriteManager.createImage("./img/chest.png"));
        this.sprites.set("bag", SpriteManager.createImage("./img/bag.png"));
        this.sprites.set("crate", SpriteManager.createImage("./img/crate.png"));
        this.sprites.set("palm0", SpriteManager.createImage("./img/palm0.png"));
        this.sprites.set("palm1", SpriteManager.createImage("./img/palm1.png"));
        this.sprites.set("palm2", SpriteManager.createImage("./img/palm2.png"));
        this.sprites.set("cactus0", SpriteManager.createImage("./img/cactus0.png"));
        this.sprites.set("fir0", SpriteManager.createImage("./img/fir0.png"));
        this.sprites.set("fir1", SpriteManager.createImage("./img/fir1.png"));
        this.sprites.set("fir2", SpriteManager.createImage("./img/fir2.png"));
        this.sprites.set("stone0", SpriteManager.createImage("./img/stone0.png"));
        this.sprites.set("stone1", SpriteManager.createImage("./img/stone1.png"));
        this.sprites.set("stone2", SpriteManager.createImage("./img/stone2.png"));
        this.sprites.set("cavestone0", SpriteManager.createImage("./img/cavestone0.png"));
        this.sprites.set("cavestone1", SpriteManager.createImage("./img/cavestone1.png"));
        this.sprites.set("cavestone2", SpriteManager.createImage("./img/cavestone2.png"));
        this.sprites.set("cavestone3", SpriteManager.createImage("./img/cavestone3.png"));
        this.sprites.set("gold0", SpriteManager.createImage("./img/gold0.png"));
        this.sprites.set("gold1", SpriteManager.createImage("./img/gold1.png"));
        this.sprites.set("gold2", SpriteManager.createImage("./img/gold2.png"));
        this.sprites.set("diamond0", SpriteManager.createImage("./img/diamond0.png"));
        this.sprites.set("diamond1", SpriteManager.createImage("./img/diamond1.png"));
        this.sprites.set("diamond2", SpriteManager.createImage("./img/diamond2.png"));
        this.sprites.set("amethyst0", SpriteManager.createImage("./img/amethyst0.png"));
        this.sprites.set("amethyst1", SpriteManager.createImage("./img/amethyst1.png"));
        this.sprites.set("amethyst2", SpriteManager.createImage("./img/amethyst2.png"));
        this.sprites.set("reidite0", SpriteManager.createImage("./img/reidite0.png"));
        this.sprites.set("reidite1", SpriteManager.createImage("./img/reidite1.png"));
        this.sprites.set("reidite2", SpriteManager.createImage("./img/reidite2.png"));
    }

    public static get(image: string) {
        const url = "./img/" + image + ".png";
        if(SpriteManager.sprites.has(image)) {
            return SpriteManager.sprites.get(image);
        } else {
            return SpriteManager.createImage(url);
        }
    }

    public static createImage(src: string) {
        const image = new Image();
        image.src = src;
        return image;
    }
}