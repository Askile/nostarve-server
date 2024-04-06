import {ClientPackets} from "../enums/packets";

export const CachedPackets = new Map<ClientPackets, Uint8Array>();

CachedPackets.set(ClientPackets.FULL, new Uint8Array([ClientPackets.FULL]));
CachedPackets.set(ClientPackets.CAPTCHA, new Uint8Array([ClientPackets.CAPTCHA]));
CachedPackets.set(ClientPackets.OLD_VERSION, new Uint8Array([ClientPackets.OLD_VERSION]));
CachedPackets.set(ClientPackets.DONT_HARVEST, new Uint8Array([ClientPackets.DONT_HARVEST]));
CachedPackets.set(ClientPackets.EMPTY_RES, new Uint8Array([ClientPackets.EMPTY_RES]));
CachedPackets.set(ClientPackets.INV_FULL, new Uint8Array([ClientPackets.INV_FULL]));
CachedPackets.set(ClientPackets.GET_BAG, new Uint8Array([ClientPackets.GET_BAG]));
CachedPackets.set(ClientPackets.CLEAN_INVENTORY, new Uint8Array([ClientPackets.CLEAN_INVENTORY]));