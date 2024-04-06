"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMap = void 0;
const biome_1 = require("./biome");
const biome_type_1 = require("../enums/types/biome.type");
const vector_1 = require("../modules/vector");
class Random {
    m;
    a;
    c;
    state;
    constructor() {
        this.m = 2 ** 31;
        this.a = 1103515245;
        this.c = 12345;
    }
    init(seed) {
        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }
    random() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state / this.m;
    }
    setSeed(seed) {
        this.state = seed;
    }
    get() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state / this.m;
    }
}
const RNG = new Random();
function generateMap(world, seed) {
    RNG.init(seed);
    const map = [];
    const tiles = [];
    const nw = world.width / 100;
    const nh = world.height / 100;
    for (let i = 0; i < nh; i++) {
        tiles[i] = [];
    }
    const forest = new biome_1.Biome(biome_type_1.BiomeType.FOREST, new vector_1.Vector(200, 200), new vector_1.Vector(15000, 15000), 0xf);
    map.push([1, biome_type_1.BiomeType.FOREST, 2, 2, 150, 150, 0xf]);
    function inside_map(i, j) {
        return i >= 0 && j >= 0 && i < nh && j < nw;
    }
    function add_single_resource(i, j, type, subtype) {
        if (i < 0 || j < 0 || i >= nh || j >= nw)
            return;
        if (tiles[i][j] === undefined)
            tiles[i][j] = {};
        if (tiles[i][j][type] !== undefined)
            return 0;
        tiles[i][j][type] = [];
        tiles[i][j][type][subtype] = [
            {
                x: j * 100 + 50,
                y: i * 100 + 50
            }
        ];
        map.push([1, type, subtype, j, i, 1]);
        return 1;
    }
    function add_river_line(i, j, size, di, dj, mem, w, h) {
        const w1 = Math.floor(w / 2);
        const w2 = Math.max(1, Math.floor(w / 2));
        const h1 = Math.floor(h / 2);
        const h2 = Math.max(1, Math.floor(h / 2));
        for (let k = 0; k < size; k++) {
            for (let _i = i - h1; _i < i + h2; _i++) {
                for (let _j = j - w1; _j < j + w2; _j++) {
                    if (add_single_resource(_i, _j, "wtb", 0) === 1)
                        mem.push([_i, _j, 1]);
                }
            }
            i += di;
            j += dj;
        }
    }
    function add_single_river(i, j, current) {
        if (!inside_map(i, j))
            return;
        if (tiles[i][j] === undefined)
            tiles[i][j] = {};
        if (tiles[i][j]["r"] !== undefined)
            return;
        let code = 0;
        if (inside_map(i - 1, j) && tiles[i - 1][j] !== undefined && tiles[i - 1][j]["wtb"] !== undefined)
            code += 2;
        if (inside_map(i, j - 1) && tiles[i][j - 1] !== undefined && tiles[i][j - 1]["wtb"] !== undefined)
            code += 8;
        if (inside_map(i, j + 1) && tiles[i][j + 1] !== undefined && tiles[i][j + 1]["wtb"] !== undefined)
            code += 16;
        if (inside_map(i + 1, j) && tiles[i + 1][j] !== undefined && tiles[i + 1][j]["wtb"] !== undefined)
            code += 64;
        if (inside_map(i - 1, j - 1) && (code & (8 + 2)) === 8 + 2 && tiles[i - 1][j - 1] !== undefined && tiles[i - 1][j - 1]["wtb"] !== undefined)
            code += 1;
        if (inside_map(i - 1, j + 1) && (code & (16 + 2)) === 16 + 2 && tiles[i - 1][j + 1] !== undefined && tiles[i - 1][j + 1]["wtb"] !== undefined)
            code += 4;
        if (inside_map(i + 1, j - 1) && (code & (8 + 64)) === 8 + 64 && tiles[i + 1][j - 1] !== undefined && tiles[i + 1][j - 1]["wtb"] !== undefined)
            code += 32;
        if (inside_map(i + 1, j + 1) && (code & (16 + 64)) === 16 + 64 && tiles[i + 1][j + 1] !== undefined && tiles[i + 1][j + 1]["wtb"] !== undefined)
            code += 128;
        tiles[i][j]["r"] = {};
        tiles[i][j]["r"]["x"] = j * 100 + 50;
        tiles[i][j]["r"]["y"] = i * 100 + 50;
        map.push([1, "r", 0, j, i, code]);
    }
    function render_river(mem) {
        for (let k = 0; k < mem.length; k++) {
            let _i = mem[k][0];
            let _j = mem[k][1];
            let current = mem[k][2];
            add_single_river(_i, _j, current);
        }
    }
    function add_river(mem) {
        var i = Math.floor(forest.position.y / 100);
        var j = Math.floor(forest.position.x / 100);
        var w = Math.floor(forest.size.x / 100);
        var h = Math.floor(forest.size.y / 100);
        var iMax = i + h;
        var jMax = j + w;
        var turn = 2;
        var _h = h;
        var _i = i;
        var _j = j + 10 + Math.floor((w - 20) * RNG.get());
        for (var __j = _j - 4; __j < _j + 4; __j++)
            add_single_resource(i - 1, __j, "wtb", 0);
        while (_h > 0) {
            // Top of the river
            if (turn === 2) {
                for (var k = 10; k > 1; k--) {
                    add_river_line(_i, _j, 1, 1, 0, mem, k, 1);
                    _h -= 1;
                    _i += 1;
                }
                turn = 0;
                continue;
            }
            // End of the river
            if (_h < 10) {
                for (var k = 1; _h > 0; k++) {
                    add_river_line(_i, _j, 1, 1, 0, mem, k, 1);
                    _h -= 1;
                    _i += 1;
                }
                continue;
            }
            if (turn === 1) {
                var __h = Math.min(_h, Math.floor(1 + 4 * RNG.get()));
                var w = 1 + Math.floor(RNG.get() * 4);
                add_river_line(_i, _j, __h, 1, 0, mem, w, w);
                turn = 0;
                _h -= __h;
                _i += __h;
                continue;
            }
            turn = 1;
            var __w = Math.floor(1 + 2 * RNG.get());
            var ___w = 1 + Math.floor(RNG.get() * 4);
            if (_j < j + 16) {
                add_river_line(_i, _j, __w, 0, 1, mem, ___w, ___w);
                _j += __w;
            }
            else if (_j > jMax - 16) {
                add_river_line(_i, _j, __w, 0, -1, mem, ___w, ___w);
                _j -= __w;
            }
            else if (RNG.get() > 0.5) {
                add_river_line(_i, _j, __w, 0, 1, mem, ___w, ___w);
                _j += __w;
            }
            else {
                add_river_line(_i, _j, __w, 0, -1, mem, ___w, ___w);
                _j -= __w;
            }
        }
        for (var __j = _j - 1; __j < _j + 2; __j++)
            add_single_resource(_i, __j, "wtb", 0);
    }
    function add_resources(type, subtype, amount, subpart) {
        let x = 2;
        let y = 2;
        let w = 150;
        let h = 150;
        if (subpart !== undefined) {
            subpart = 1 - subpart;
            x += Math.floor(w * subpart / 2);
            y += Math.floor(h * subpart / 2);
            w += Math.floor(w * subpart);
            h += Math.floor(h * subpart);
        }
        for (let k = 0, l = 0; k < amount; l++) {
            if (l > 50000)
                break;
            const i = Math.floor(y + RNG.get() * h);
            const j = Math.floor(x + RNG.get() * w);
            const dist = world.getDistFromBiome(forest, j * 100 + 50, i * 100 + 50);
            if (dist < 400)
                continue;
            // Do not bind same resource type
            var tile = tiles[i][j + 1];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i][j - 1];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i + 1][j];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i - 1][j];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i + 1][j - 1];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i - 1][j + 1];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i + 1][j + 1];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            var tile = tiles[i - 1][j - 1];
            if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
                continue;
            if (tiles[i][j] === undefined) {
                add_single_resource(i, j, type, subtype);
                k++;
            }
        }
    }
    let size = 1.5;
    for (let i = 0; i < 6; i++)
        add_resources("t", i, Math.floor(80 * size));
    for (let i = 0; i < 4; i++)
        add_resources("b", i, Math.floor(80 * size));
    for (let i = 0; i < 3; i++)
        add_resources("s", i, Math.floor(50 * size));
    let mem = [];
    for (let i = 0; i < 6; i++)
        add_river(mem);
    render_river(mem);
    add_resources("p", 0, Math.floor(28 * size));
    for (let i = 0; i < 3; i++)
        add_resources("g", i, Math.floor(7 * size));
    for (let i = 0; i < 3; i++)
        add_resources("d", i, Math.floor(2 * size));
    for (let i = 0; i < 3; i++)
        add_resources("a", i, Math.floor(1 * size));
    for (let i = 0; i < 3; i++)
        add_resources("m", i, Math.floor(1 * size));
    add_resources("a", 0, Math.floor(1 * size));
    add_single_resource(-3 + Math.floor(forest.endPosition.y / 100), -1 + Math.floor(forest.endPosition.x / 100), "s", 0);
    add_single_resource(3 + Math.floor(forest.endPosition.y / 100), 1 + Math.floor(forest.endPosition.x / 100), "s", 0);
    add_single_resource(-3 + Math.floor(forest.position.y / 100), -1 + Math.floor(forest.position.x / 100), "s", 0);
    add_single_resource(3 + Math.floor(forest.position.y / 100), 1 + Math.floor(forest.position.x / 100), "s", 0);
    return map;
}
exports.generateMap = generateMap;
