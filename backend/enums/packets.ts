export enum ClientPackets {
    UNITS,
    UNITS_EXTENDED,
    CANCEL_CRAFT,
    GATHER,
    OLD_VERSION,
    FULL,
    DONT_HARVEST,
    HITTEN,
    BUILD_STOP,
    BUILD_OK,
    INV_FULL,
    DECREASE_ITEM,
    WORKBENCH,
    HITTEN_OTHER,
    MUTE,
    KILL_PLAYER,
    GAUGES,
    RECOVER_FOCUS,
    EMPTY_RES,
    FIRE,
    SURVIVE,
    LEADERBOARD,
    GET_TIME,
    SET_CAM,
    ACCEPT_BUILD,
    KILLED,
    MINIMAP,
    FAIL_RESTORE,
    GHOST,
    REBORN,
    STEAL_TOKEN,
    JOIN_NEW_TEAM,
    EXCLUDE_TEAM,
    NEW_MEMBER_TEAM,
    DESTROY_TEAM,
    KIT_OK,
    WATER,
    GAUGES_LIFE,
    GAUGES_FOOD,
    GAUGES_WATER,
    GET_BAG,
    VERIFIED_ACCOUNT,
    SUCCEED_QUEST,
    FAIL_QUEST,
    CLAIMED,
    RECYCLE_OK,
    RECYCLE_STOP,
    WELL,
    NO_RESOURCES,
    DECREASE_ITEM_2 = 50,
    BLOCKED,
    DELETE_INV_OK,
    DELETE_ONE_INV_OK,
    ACCOUNT_OK,
    GAUGES_WARM,
    GAUGES_COLD,
    NEW_VERSION,
    WRONG_PASSWORD,
    CLEAN_INVENTORY,
    HIDE_SHOP_KIT,
    CAMERA_CONFIG,
    DELETE_SINGLE_INV,
    HIDE_CLOCK,
    HIDE_RECIPE_BOOK,
    HIDE_QUEST,
    HIDE_MARKET,
    EXPLORER_QUEST,
    SAND_TEMPEST,
    BLIZZARD,
    BLIZZARD_STATUS,
    BANDAGE,
    SET_MARKET,
    CAPTCHA = 100
}

export enum ClientStringPackets {
    CHAT,
    KICK,
    NEW_PLAYER,
    HANDSHAKE,
    MESSAGE,
    COMMAND,
    WELCOME,
    SESSION_LIST
}

export enum ServerPackets {
    CHAT,
    CAMERA,
    MOVEMENT,
    ANGLE,
    ATTACK,
    INTERACTION,
    DROP_ONE_ITEM,
    CRAFT,
    GIVE_ITEM,
    TAKE_ITEM,
    BUILD,
    GET_FOCUS,
    GIVE_FURNACE,
    PING,
    STOP_ATTACK,
    UNLOCK_CHEST,
    LOCK_CHEST,
    RESURRECTION,
    JOIN_TEAM,
    LEAVE_TEAM,
    KICK_TEAM,
    CHOOSE_KIT,
    GIVE_WHEAT,
    TAKE_FLOUR,
    GIVE_FLOUR_OVEN,
    GIVE_WOOD_OVEN,
    TAKE_BREAD_OVEN,
    CLAIM_QUEST_REWARD,
    DROP_ITEM,
    RECYCLE_START,
    GIVE_WELL,
    CANCEL_CRAFT,
    MARKET,
    LOCK_TEAM,
    CONSOLE,
    TAKE_EXTRACTOR,
    GIVE_WOOD_EXTRACTOR,
    GET_SESSIONS
}