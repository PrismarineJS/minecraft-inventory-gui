import { Item, ClientInventory } from './ClientInventory.js'
import { ServerInventory } from './Inventory2.js'

window.inventory.getImageIcon = (item) => {
  const itemId = item.type
  const items = ["apple", "apple_golden", "armor_stand", "arrow", "bamboo", "banner_pattern", "bed_black", "bed_blue", "bed_brown", "bed_cyan", "bed_gray", "bed_green", "bed_light_blue", "bed_lime", "bed_magenta", "bed_orange", "bed_pink", "bed_purple", "bed_red", "bed_silver", "bed_white", "bed_yellow", "beef_cooked", "beef_raw", "beetroot", "beetroot_soup", "blaze_powder", "blaze_rod", "boat", "boat_acacia", "boat_birch", "boat_darkoak", "boat_jungle", "boat_oak", "boat_spruce", "bone", "book_enchanted", "book_normal", "book_portfolio", "book_writable", "book_written", "bowl", "bow_pulling_0", "bow_pulling_1", "bow_pulling_2", "bow_standby", "bread", "brewing_stand", "brick", "broken_elytra", "bucket_cod", "bucket_empty", "bucket_lava", "bucket_milk", "bucket_pufferfish", "bucket_salmon", "bucket_tropical", "bucket_water", "cake", "campfire", "carrot", "carrot_golden", "carrot_on_a_stick", "cauldron", "chain", "chainmail_boots", "chainmail_chestplate", "chainmail_helmet", "chainmail_leggings", "chalkboard_large", "chalkboard_medium", "chalkboard_small", "charcoal", "chicken_cooked", "chicken_raw", "chorus_fruit", "chorus_fruit_popped", "clay_ball", "clock_item", "coal", "comparator", "compass_atlas", "compass_item", "cookie", "crimson_door", "crossbow_arrow", "crossbow_firework", "crossbow_pulling_0", "crossbow_pulling_1", "crossbow_pulling_2", "crossbow_standby", "diamond", "diamond_axe", "diamond_boots", "diamond_chestplate", "diamond_helmet", "diamond_hoe", "diamond_horse_armor", "diamond_leggings", "diamond_pickaxe", "diamond_shovel", "diamond_sword", "door_acacia", "door_birch", "door_dark_oak", "door_iron", "door_jungle", "door_spruce", "door_wood", "dragons_breath", "dragon_fireball", "dried_kelp", "dye_powder_black", "dye_powder_black_new", "dye_powder_blue", "dye_powder_blue_new", "dye_powder_brown", "dye_powder_brown_new", "dye_powder_cyan", "dye_powder_gray", "dye_powder_green", "dye_powder_light_blue", "dye_powder_lime", "dye_powder_magenta", "dye_powder_orange", "dye_powder_pink", "dye_powder_purple", "dye_powder_red", "dye_powder_silver", "dye_powder_white", "dye_powder_white_new", "dye_powder_yellow", "egg", "egg_agent", "egg_bat", "egg_bee", "egg_blaze", "egg_cat", "egg_cave_spider", "egg_chicken", "egg_clownfish", "egg_cod", "egg_cow", "egg_creeper", "egg_dolphin", "egg_donkey", "egg_drowned", "egg_elderguardian", "egg_enderman", "egg_endermite", "egg_evoker", "egg_fish", "egg_fox", "egg_ghast", "egg_guardian", "egg_horse", "egg_husk", "egg_lava_slime", "egg_llama", "egg_mask", "egg_mule", "egg_mushroomcow", "egg_npc", "egg_null", "egg_ocelot", "egg_panda", "egg_parrot", "egg_phantom", "egg_pig", "egg_pigzombie", "egg_pillager", "egg_polarbear", "egg_pufferfish", "egg_rabbit", "egg_ravager", "egg_salmon", "egg_sheep", "egg_shulker", "egg_silverfish", "egg_skeleton", "egg_skeletonhorse", "egg_slime", "egg_spider", "egg_squid", "egg_stray", "egg_template", "egg_turtle", "egg_vex", "egg_villager", "egg_vindicator", "egg_wanderingtrader", "egg_witch", "egg_wither", "egg_wolf", "egg_zombie", "egg_zombiehorse", "egg_zombievillager", "elytra", "emerald", "empty_armor_slot_boots", "empty_armor_slot_chestplate", "empty_armor_slot_helmet", "empty_armor_slot_leggings", "empty_armor_slot_shield", "ender_eye", "ender_pearl", "end_crystal", "experience_bottle", "feather", "fireball", "fireworks", "fireworks_charge", "fishing_rod_cast", "fishing_rod_uncast", "fish_clownfish_raw", "fish_cooked", "fish_pufferfish_raw", "fish_raw", "fish_salmon_cooked", "fish_salmon_raw", "flint", "flint_and_steel", "flower_pot", "ghast_tear", "glowstone_dust", "gold_axe", "gold_boots", "gold_chestplate", "gold_helmet", "gold_hoe", "gold_horse_armor", "gold_ingot", "gold_leggings", "gold_nugget", "gold_pickaxe", "gold_shovel", "gold_sword", "gunpowder", "heartofthesea_closed", "hoglin_meat_cooked", "hoglin_meat_raw", "honeycomb", "honey_bottle", "hopper", "iron_axe", "iron_boots", "iron_chestplate", "iron_helmet", "iron_hoe", "iron_horse_armor", "iron_ingot", "iron_leggings", "iron_nugget", "iron_pickaxe", "iron_shovel", "iron_sword", "item_frame", "kelp", "lantern", "lead", "leather", "leather_boots", "leather_chestplate", "leather_helmet", "leather_horse_armor", "leather_leggings", "lever", "light_block_0", "light_block_1", "light_block_10", "light_block_11", "light_block_12", "light_block_13", "light_block_14", "light_block_15", "light_block_2", "light_block_3", "light_block_4", "light_block_5", "light_block_6", "light_block_7", "light_block_8", "light_block_9", "lodestonecompass_atlas", "lodestonecompass_item", "magma_cream", "map_empty", "map_filled", "map_locked", "map_mansion", "map_monument", "map_nautilus", "melon", "melon_speckled", "minecart_chest", "minecart_command_block", "minecart_furnace", "minecart_hopper", "minecart_normal", "minecart_tnt", "mushroom_stew", "mutton_cooked", "mutton_raw", "name_tag", "nautilus", "netherbrick", "netherite_axe", "netherite_boots", "netherite_chestplate", "netherite_helmet", "netherite_hoe", "netherite_ingot", "netherite_leggings", "netherite_pickaxe", "netherite_scrap", "netherite_shovel", "netherite_sword", "nether_sprouts", "nether_star", "nether_wart", "painting", "paper", "phantom_membrane", "porkchop_cooked", "porkchop_raw", "potato", "potato_baked", "potato_poisonous", "potion_bottle_absorption", "potion_bottle_blindness", "potion_bottle_confusion", "potion_bottle_damageBoost", "potion_bottle_digSlowdown", "potion_bottle_digSpeed", "potion_bottle_drinkable", "potion_bottle_empty", "potion_bottle_fireResistance", "potion_bottle_harm", "potion_bottle_heal", "potion_bottle_healthBoost", "potion_bottle_hunger", "potion_bottle_invisibility", "potion_bottle_jump", "potion_bottle_levitation", "potion_bottle_lingering", "potion_bottle_lingering_damageBoost", "potion_bottle_lingering_empty", "potion_bottle_lingering_fireResistance", "potion_bottle_lingering_harm", "potion_bottle_lingering_heal", "potion_bottle_lingering_invisibility", "potion_bottle_lingering_jump", "potion_bottle_lingering_luck", "potion_bottle_lingering_moveSlowdown", "potion_bottle_lingering_moveSpeed", "potion_bottle_lingering_nightVision", "potion_bottle_lingering_poison", "potion_bottle_lingering_regeneration", "potion_bottle_lingering_slowFall", "potion_bottle_lingering_turtleMaster", "potion_bottle_lingering_waterBreathing", "potion_bottle_lingering_weakness", "potion_bottle_lingering_wither", "potion_bottle_moveSlowdown", "potion_bottle_moveSpeed", "potion_bottle_nightVision", "potion_bottle_poison", "potion_bottle_regeneration", "potion_bottle_resistance", "potion_bottle_saturation", "potion_bottle_slowFall", "potion_bottle_splash", "potion_bottle_splash_absorption", "potion_bottle_splash_blindness", "potion_bottle_splash_confusion", "potion_bottle_splash_damageBoost", "potion_bottle_splash_digSlowdown", "potion_bottle_splash_digSpeed", "potion_bottle_splash_fireResistance", "potion_bottle_splash_harm", "potion_bottle_splash_heal", "potion_bottle_splash_healthBoost", "potion_bottle_splash_hunger", "potion_bottle_splash_invisibility", "potion_bottle_splash_jump", "potion_bottle_splash_levitation", "potion_bottle_splash_moveSlowdown", "potion_bottle_splash_moveSpeed", "potion_bottle_splash_nightVision", "potion_bottle_splash_poison", "potion_bottle_splash_regeneration", "potion_bottle_splash_resistance", "potion_bottle_splash_saturation", "potion_bottle_splash_slowFall", "potion_bottle_splash_turtleMaster", "potion_bottle_splash_waterBreathing", "potion_bottle_splash_weakness", "potion_bottle_splash_wither", "potion_bottle_turtleMaster", "potion_bottle_waterBreathing", "potion_bottle_weakness", "potion_bottle_wither", "potion_overlay", "prismarine_crystals", "prismarine_shard", "pumpkin_pie", "quartz", "quiver", "rabbit_cooked", "rabbit_foot", "rabbit_hide", "rabbit_raw", "rabbit_stew", "record_11", "record_13", "record_blocks", "record_cat", "record_chirp", "record_far", "record_mall", "record_mellohi", "record_pigstep", "record_stal", "record_strad", "record_wait", "record_ward", "redstone_dust", "reeds", "repeater", "rotten_flesh", "ruby", "saddle", "sea_pickle", "seeds_beetroot", "seeds_melon", "seeds_pumpkin", "seeds_wheat", "shears", "shulker_shell", "sign", "sign_acacia", "sign_birch", "sign_crimson", "sign_darkoak", "sign_jungle", "sign_spruce", "sign_warped", "slimeball", "snowball", "soul_campfire", "soul_lantern", "spawn_egg", "spawn_egg_overlay", "spider_eye", "spider_eye_fermented", "stick", "stone_axe", "stone_hoe", "stone_pickaxe", "stone_shovel", "stone_sword", "string", "sugar", "suspicious_stew", "sweet_berries", "tipped_arrow", "tipped_arrow_base", "tipped_arrow_fireres", "tipped_arrow_harm", "tipped_arrow_head", "tipped_arrow_healing", "tipped_arrow_invisibility", "tipped_arrow_leaping", "tipped_arrow_luck", "tipped_arrow_nightvision", "tipped_arrow_poison", "tipped_arrow_regen", "tipped_arrow_slow", "tipped_arrow_slowfalling", "tipped_arrow_strength", "tipped_arrow_swift", "tipped_arrow_turtlemaster", "tipped_arrow_waterbreathing", "tipped_arrow_weakness", "tipped_arrow_wither", "totem", "trident", "turtle_egg", "turtle_helmet", "turtle_shell_piece", "villagebell", "warped_door", "warped_fungus_on_a_stick", "watch_atlas", "wheat", "wood_axe", "wood_hoe", "wood_pickaxe", "wood_shovel", "wood_sword"]
  const blocks = ["acacia_trapdoor", "ancient_debris_side", "ancient_debris_top", "anvil_base", "anvil_top_damaged_0", "anvil_top_damaged_1", "anvil_top_damaged_2", "bamboo_leaf", "bamboo_sapling", "bamboo_singleleaf", "bamboo_small_leaf", "bamboo_stem", "barrel_bottom", "barrel_side", "barrel_top", "barrel_top_open", "barrier", "basalt_side", "basalt_top", "beacon", "bedrock", "bed_feet_end", "bed_feet_side", "bed_feet_top", "bed_head_end", "bed_head_side", "bed_head_top", "beehive_front", "beehive_front_honey", "beehive_side", "beehive_top", "beetroots_stage_0", "beetroots_stage_1", "beetroots_stage_2", "beetroots_stage_3", "bee_nest_bottom", "bee_nest_front", "bee_nest_front_honey", "bee_nest_side", "bee_nest_top", "bell_bottom", "bell_side", "bell_top", "birch_trapdoor", "blackstone", "blackstone_top", "blast_furnace_front_off", "blast_furnace_front_on", "blast_furnace_side", "blast_furnace_top", "blue_ice", "bone_block_side", "bone_block_top", "bookshelf", "border", "brewing_stand", "brewing_stand_base", "brick", "bubble_column_down_top_a", "bubble_column_down_top_b", "bubble_column_down_top_c", "bubble_column_down_top_d", "bubble_column_inner_a", "bubble_column_inner_b", "bubble_column_outer_a", "bubble_column_outer_b", "bubble_column_outer_c", "bubble_column_outer_d", "bubble_column_outer_e", "bubble_column_outer_f", "bubble_column_outer_g", "bubble_column_outer_h", "bubble_column_up_top_a", "bubble_column_up_top_b", "bubble_column_up_top_c", "bubble_column_up_top_d", "build_allow", "build_deny", "cactus_bottom", "cactus_side", "cactus_top", "cake_bottom", "cake_inner", "cake_side", "cake_top", "camera_back", "camera_front", "camera_side", "camera_top", "campfire", "campfire_log", "campfire_log_lit", "carried_waterlily", "carrots_stage_0", "carrots_stage_1", "carrots_stage_2", "carrots_stage_3", "cartography_table_side1", "cartography_table_side2", "cartography_table_side3", "cartography_table_top", "cauldron_bottom", "cauldron_inner", "cauldron_side", "cauldron_top", "cauldron_water", "cauldron_water_placeholder", "chain1", "chain2", "chain_command_block_back", "chain_command_block_back_mipmap", "chain_command_block_conditional", "chain_command_block_conditional_mipmap", "chain_command_block_front", "chain_command_block_front_mipmap", "chain_command_block_side", "chain_command_block_side_mipmap", "chest_front", "chest_side", "chest_top", "chiseled_nether_bricks", "chiseled_polished_blackstone", "chorus_flower", "chorus_flower_dead", "chorus_plant", "clay", "coal_block", "coal_ore", "coarse_dirt", "cobblestone", "cobblestone_mossy", "cocoa_stage_0", "cocoa_stage_1", "cocoa_stage_2", "command_block", "command_block_back", "command_block_back_mipmap", "command_block_conditional", "command_block_conditional_mipmap", "command_block_front", "command_block_front_mipmap", "command_block_side", "command_block_side_mipmap", "comparator_off", "comparator_on", "compost", "composter_bottom", "composter_side", "composter_top", "compost_ready", "concrete_black", "concrete_blue", "concrete_brown", "concrete_cyan", "concrete_gray", "concrete_green", "concrete_light_blue", "concrete_lime", "concrete_magenta", "concrete_orange", "concrete_pink", "concrete_powder_black", "concrete_powder_blue", "concrete_powder_brown", "concrete_powder_cyan", "concrete_powder_gray", "concrete_powder_green", "concrete_powder_light_blue", "concrete_powder_lime", "concrete_powder_magenta", "concrete_powder_orange", "concrete_powder_pink", "concrete_powder_purple", "concrete_powder_red", "concrete_powder_silver", "concrete_powder_white", "concrete_powder_yellow", "concrete_purple", "concrete_red", "concrete_silver", "concrete_white", "concrete_yellow", "conduit_base", "conduit_cage", "conduit_closed", "conduit_open", "conduit_wind_horizontal", "conduit_wind_vertical", "coral_blue", "coral_blue_dead", "coral_fan_blue", "coral_fan_blue_dead", "coral_fan_pink", "coral_fan_pink_dead", "coral_fan_purple", "coral_fan_purple_dead", "coral_fan_red", "coral_fan_red_dead", "coral_fan_yellow", "coral_fan_yellow_dead", "coral_pink", "coral_pink_dead", "coral_plant_blue", "coral_plant_blue_dead", "coral_plant_pink", "coral_plant_pink_dead", "coral_plant_purple", "coral_plant_purple_dead", "coral_plant_red", "coral_plant_red_dead", "coral_plant_yellow", "coral_plant_yellow_dead", "coral_purple", "coral_purple_dead", "coral_red", "coral_red_dead", "coral_yellow", "coral_yellow_dead", "cracked_nether_bricks", "cracked_polished_blackstone_bricks", "crafting_table_front", "crafting_table_side", "crafting_table_top", "crimson_fungus", "crimson_nylium_side", "crimson_nylium_top", "crimson_roots", "crimson_roots_pot", "crying_obsidian", "dark_oak_trapdoor", "daylight_detector_inverted_top", "daylight_detector_side", "daylight_detector_top", "deadbush", "diamond_block", "diamond_ore", "dirt", "dirt_podzol_side", "dirt_podzol_top", "dispenser_front_horizontal", "dispenser_front_vertical", "door_acacia_lower", "door_acacia_upper", "door_birch_lower", "door_birch_upper", "door_dark_oak_lower", "door_dark_oak_upper", "door_iron_lower", "door_iron_upper", "door_jungle_lower", "door_jungle_upper", "door_spruce_lower", "door_spruce_upper", "door_wood_lower", "door_wood_upper", "double_plant_fern_bottom", "double_plant_fern_carried", "double_plant_fern_top", "double_plant_grass_bottom", "double_plant_grass_carried", "double_plant_grass_top", "double_plant_paeonia_bottom", "double_plant_paeonia_top", "double_plant_rose_bottom", "double_plant_rose_top", "double_plant_sunflower_back", "double_plant_sunflower_bottom", "double_plant_sunflower_front", "double_plant_sunflower_top", "double_plant_syringa_bottom", "double_plant_syringa_top", "dragon_egg", "dried_kelp_side_a", "dried_kelp_side_b", "dried_kelp_top", "dropper_front_horizontal", "dropper_front_vertical", "emerald_block", "emerald_ore", "enchanting_table_bottom", "enchanting_table_side", "enchanting_table_top", "ender_chest_front", "ender_chest_side", "ender_chest_top", "endframe_eye", "endframe_side", "endframe_top", "end_bricks", "end_gateway", "end_portal", "end_rod", "end_stone", "farmland_dry", "farmland_wet", "fern", "fern_carried", "fire_0", "fire_0_placeholder", "fire_1", "fire_1_placeholder", "fletcher_table_side1", "fletcher_table_side2", "fletcher_table_top", "flower_allium", "flower_blue_orchid", "flower_cornflower", "flower_dandelion", "flower_houstonia", "flower_lily_of_the_valley", "flower_oxeye_daisy", "flower_paeonia", "flower_pot", "flower_rose", "flower_rose_blue", "flower_tulip_orange", "flower_tulip_pink", "flower_tulip_red", "flower_tulip_white", "flower_wither_rose", "frosted_ice_0", "frosted_ice_1", "frosted_ice_2", "frosted_ice_3", "furnace_front_off", "furnace_front_on", "furnace_side", "furnace_top", "gilded_blackstone", "glass", "glass_black", "glass_blue", "glass_brown", "glass_cyan", "glass_gray", "glass_green", "glass_light_blue", "glass_lime", "glass_magenta", "glass_orange", "glass_pane_top", "glass_pane_top_black", "glass_pane_top_blue", "glass_pane_top_brown", "glass_pane_top_cyan", "glass_pane_top_gray", "glass_pane_top_green", "glass_pane_top_light_blue", "glass_pane_top_lime", "glass_pane_top_magenta", "glass_pane_top_orange", "glass_pane_top_pink", "glass_pane_top_purple", "glass_pane_top_red", "glass_pane_top_silver", "glass_pane_top_white", "glass_pane_top_yellow", "glass_pink", "glass_purple", "glass_red", "glass_silver", "glass_white", "glass_yellow", "glazed_terracotta_black", "glazed_terracotta_blue", "glazed_terracotta_brown", "glazed_terracotta_cyan", "glazed_terracotta_gray", "glazed_terracotta_green", "glazed_terracotta_light_blue", "glazed_terracotta_lime", "glazed_terracotta_magenta", "glazed_terracotta_orange", "glazed_terracotta_pink", "glazed_terracotta_purple", "glazed_terracotta_red", "glazed_terracotta_silver", "glazed_terracotta_white", "glazed_terracotta_yellow", "glowing_obsidian", "glowstone", "gold_block", "gold_ore", "grass_carried", "grass_path_side", "grass_path_top", "grass_side", "grass_side_carried", "grass_side_snowed", "grass_side_snowed", "grass_top", "gravel", "grindstone_pivot", "grindstone_round", "grindstone_side", "hardened_clay", "hardened_clay_stained_black", "hardened_clay_stained_blue", "hardened_clay_stained_brown", "hardened_clay_stained_cyan", "hardened_clay_stained_gray", "hardened_clay_stained_green", "hardened_clay_stained_light_blue", "hardened_clay_stained_lime", "hardened_clay_stained_magenta", "hardened_clay_stained_orange", "hardened_clay_stained_pink", "hardened_clay_stained_purple", "hardened_clay_stained_red", "hardened_clay_stained_silver", "hardened_clay_stained_white", "hardened_clay_stained_yellow", "hay_block_side", "hay_block_top", "honeycomb", "honey_bottom", "honey_side", "honey_top", "hopper_inside", "hopper_outside", "hopper_top", "huge_fungus", "ice", "ice_packed", "iron_bars", "iron_block", "iron_ore", "iron_trapdoor", "itemframe_background", "jigsaw_back", "jigsaw_front", "jigsaw_lock", "jigsaw_side", "jukebox_side", "jukebox_top", "jungle_trapdoor", "kelp_a", "kelp_b", "kelp_c", "kelp_d", "kelp_top", "kelp_top_bulb", "ladder", "lantern", "lapis_block", "lapis_ore", "lava_flow", "lava_placeholder", "lava_still", "leaves_acacia", "leaves_acacia_carried", "leaves_acacia_opaque", "leaves_big_oak", "leaves_big_oak_carried", "leaves_big_oak_opaque", "leaves_birch", "leaves_birch_carried", "leaves_birch_opaque", "leaves_jungle", "leaves_jungle_carried", "leaves_jungle_opaque", "leaves_oak", "leaves_oak_carried", "leaves_oak_opaque", "leaves_spruce", "leaves_spruce_carried", "leaves_spruce_opaque", "lectern_base", "lectern_front", "lectern_sides", "lectern_top", "lever", "lodestone_side", "lodestone_top", "log_acacia", "log_acacia_top", "log_big_oak", "log_big_oak_top", "log_birch", "log_birch_top", "log_jungle", "log_jungle_top", "log_oak", "log_oak_top", "log_spruce", "log_spruce_top", "loom_bottom", "loom_front", "loom_side", "loom_top", "magma", "melon_side", "melon_stem_connected", "melon_stem_disconnected", "melon_top", "missing_tile", "mob_spawner", "mushroom_block_inside", "mushroom_block_skin_brown", "mushroom_block_skin_red", "mushroom_block_skin_stem", "mushroom_brown", "mushroom_red", "mycelium_side", "mycelium_top", "netherite_block", "netherrack", "nether_brick", "nether_gold_ore", "nether_sprouts", "nether_wart_block", "nether_wart_stage_0", "nether_wart_stage_1", "nether_wart_stage_2", "noteblock", "observer_back", "observer_back_lit", "observer_front", "observer_side", "observer_top", "obsidian", "piston_bottom", "piston_inner", "piston_side", "piston_top_normal", "piston_top_sticky", "planks_acacia", "planks_big_oak", "planks_birch", "planks_jungle", "planks_oak", "planks_spruce", "polished_basalt_side", "polished_basalt_top", "polished_blackstone", "polished_blackstone_bricks", "portal", "portal_placeholder", "potatoes_stage_0", "potatoes_stage_1", "potatoes_stage_2", "potatoes_stage_3", "prismarine_bricks", "prismarine_dark", "prismarine_rough", "pumpkin_face_off", "pumpkin_face_on", "pumpkin_side", "pumpkin_stem_connected", "pumpkin_stem_disconnected", "pumpkin_top", "purpur_block", "purpur_pillar", "purpur_pillar_top", "quartz_block_bottom", "quartz_block_chiseled", "quartz_block_chiseled_top", "quartz_block_lines", "quartz_block_lines_top", "quartz_block_side", "quartz_block_top", "quartz_bricks", "quartz_ore", "rail_activator", "rail_activator_powered", "rail_detector", "rail_detector_powered", "rail_golden", "rail_golden_powered", "rail_normal", "rail_normal_turned", "reactor_core_stage_0", "reactor_core_stage_1", "reactor_core_stage_2", "redstone_block", "redstone_dust_cross", "redstone_dust_line", "redstone_lamp_off", "redstone_lamp_on", "redstone_ore", "redstone_torch_off", "redstone_torch_on", "red_nether_brick", "red_sand", "red_sandstone_bottom", "red_sandstone_carved", "red_sandstone_normal", "red_sandstone_smooth", "red_sandstone_top", "reeds", "repeater_off", "repeater_on", "repeating_command_block_back", "repeating_command_block_back_mipmap", "repeating_command_block_conditional", "repeating_command_block_conditional_mipmap", "repeating_command_block_front", "repeating_command_block_front_mipmap", "repeating_command_block_side", "repeating_command_block_side_mipmap", "respawn_anchor_bottom", "respawn_anchor_side0", "respawn_anchor_side1", "respawn_anchor_side2", "respawn_anchor_side3", "respawn_anchor_side4", "respawn_anchor_top", "respawn_anchor_top_off", "sand", "sandstone_bottom", "sandstone_carved", "sandstone_normal", "sandstone_smooth", "sandstone_top", "sapling_acacia", "sapling_birch", "sapling_jungle", "sapling_oak", "sapling_roofed_oak", "sapling_spruce", "scaffolding_bottom", "scaffolding_side", "scaffolding_top", "seagrass", "seagrass_carried", "seagrass_doubletall_bottom_a", "seagrass_doubletall_bottom_b", "seagrass_doubletall_top_a", "seagrass_doubletall_top_b", "sea_lantern", "sea_pickle", "shroomlight", "shulker_top_black", "shulker_top_blue", "shulker_top_brown", "shulker_top_cyan", "shulker_top_gray", "shulker_top_green", "shulker_top_light_blue", "shulker_top_lime", "shulker_top_magenta", "shulker_top_orange", "shulker_top_pink", "shulker_top_purple", "shulker_top_red", "shulker_top_silver", "shulker_top_undyed", "shulker_top_white", "shulker_top_yellow", "slime", "smithing_table_bottom", "smithing_table_front", "smithing_table_side", "smithing_table_top", "smoker_bottom", "smoker_front_off", "smoker_front_on", "smoker_side", "smoker_top", "snow", "soul_campfire", "soul_campfire_log_lit", "soul_fire_0", "soul_fire_1", "soul_lantern", "soul_sand", "soul_soil", "soul_torch", "sponge", "sponge_wet", "spruce_trapdoor", "stone", "stonebrick", "stonebrick_carved", "stonebrick_cracked", "stonebrick_mossy", "stonecutter2_bottom", "stonecutter2_saw", "stonecutter2_side", "stonecutter2_top", "stonecutter_bottom", "stonecutter_other_side", "stonecutter_side", "stonecutter_top", "stone_andesite", "stone_andesite_smooth", "stone_diorite", "stone_diorite_smooth", "stone_granite", "stone_granite_smooth", "stone_slab_side", "stone_slab_top", "stripped_acacia_log", "stripped_acacia_log_top", "stripped_birch_log", "stripped_birch_log_top", "stripped_dark_oak_log", "stripped_dark_oak_log_top", "stripped_jungle_log", "stripped_jungle_log_top", "stripped_oak_log", "stripped_oak_log_top", "stripped_spruce_log", "stripped_spruce_log_top", "structure_air", "structure_block", "structure_block_corner", "structure_block_data", "structure_block_export", "structure_block_load", "structure_block_save", "structure_void", "sweet_berry_bush_stage0", "sweet_berry_bush_stage1", "sweet_berry_bush_stage2", "sweet_berry_bush_stage3", "tallgrass", "tallgrass", "tallgrass_carried", "target_side", "target_top", "tnt_bottom", "tnt_side", "tnt_top", "torch_on", "trapdoor", "trapped_chest_front", "trip_wire", "trip_wire_source", "turtle_egg_not_cracked", "turtle_egg_slightly_cracked", "turtle_egg_very_cracked", "twisting_vines_base", "twisting_vines_bottom", "vine", "vine_carried", "warped_fungus", "warped_nylium_side", "warped_nylium_top", "warped_roots", "warped_roots_pot", "warped_wart_block", "waterlily", "water_flow", "water_flow_grey", "water_placeholder", "water_still", "water_still_grey", "web", "weeping_vines_base", "weeping_vines_bottom", "wheat_stage_0", "wheat_stage_1", "wheat_stage_2", "wheat_stage_3", "wheat_stage_4", "wheat_stage_5", "wheat_stage_6", "wheat_stage_7", "wool_colored_black", "wool_colored_blue", "wool_colored_brown", "wool_colored_cyan", "wool_colored_gray", "wool_colored_green", "wool_colored_light_blue", "wool_colored_lime", "wool_colored_magenta", "wool_colored_orange", "wool_colored_pink", "wool_colored_purple", "wool_colored_red", "wool_colored_silver", "wool_colored_white", "wool_colored_yellow"]
  const itemsjava = ["acacia_boat", "acacia_door", "acacia_sign", "apple", "armor_stand", "arrow", "baked_potato", "bamboo", "barrier", "beef", "beetroot", "beetroot_seeds", "beetroot_soup", "bell", "birch_boat", "birch_door", "birch_sign", "black_dye", "blaze_powder", "blaze_rod", "blue_dye", "bone", "bone_meal", "book", "bow", "bowl", "bow_pulling_0", "bow_pulling_1", "bow_pulling_2", "bread", "brewing_stand", "brick", "broken_elytra", "brown_dye", "bucket", "cake", "campfire", "carrot", "carrot_on_a_stick", "cauldron", "chain", "chainmail_boots", "chainmail_chestplate", "chainmail_helmet", "chainmail_leggings", "charcoal", "chest_minecart", "chicken", "chorus_fruit", "clay_ball", "clock_00", "clock_01", "clock_02", "clock_03", "clock_04", "clock_05", "clock_06", "clock_07", "clock_08", "clock_09", "clock_10", "clock_11", "clock_12", "clock_13", "clock_14", "clock_15", "clock_16", "clock_17", "clock_18", "clock_19", "clock_20", "clock_21", "clock_22", "clock_23", "clock_24", "clock_25", "clock_26", "clock_27", "clock_28", "clock_29", "clock_30", "clock_31", "clock_32", "clock_33", "clock_34", "clock_35", "clock_36", "clock_37", "clock_38", "clock_39", "clock_40", "clock_41", "clock_42", "clock_43", "clock_44", "clock_45", "clock_46", "clock_47", "clock_48", "clock_49", "clock_50", "clock_51", "clock_52", "clock_53", "clock_54", "clock_55", "clock_56", "clock_57", "clock_58", "clock_59", "clock_60", "clock_61", "clock_62", "clock_63", "coal", "cocoa_beans", "cod", "cod_bucket", "command_block_minecart", "comparator", "compass_00", "compass_01", "compass_02", "compass_03", "compass_04", "compass_05", "compass_06", "compass_07", "compass_08", "compass_09", "compass_10", "compass_11", "compass_12", "compass_13", "compass_14", "compass_15", "compass_16", "compass_17", "compass_18", "compass_19", "compass_20", "compass_21", "compass_22", "compass_23", "compass_24", "compass_25", "compass_26", "compass_27", "compass_28", "compass_29", "compass_30", "compass_31", "cooked_beef", "cooked_chicken", "cooked_cod", "cooked_mutton", "cooked_porkchop", "cooked_rabbit", "cooked_salmon", "cookie", "creeper_banner_pattern", "crimson_door", "crimson_sign", "crossbow_arrow", "crossbow_firework", "crossbow_pulling_0", "crossbow_pulling_1", "crossbow_pulling_2", "crossbow_standby", "cyan_dye", "dark_oak_boat", "dark_oak_door", "dark_oak_sign", "diamond", "diamond_axe", "diamond_boots", "diamond_chestplate", "diamond_helmet", "diamond_hoe", "diamond_horse_armor", "diamond_leggings", "diamond_pickaxe", "diamond_shovel", "diamond_sword", "dragon_breath", "dried_kelp", "egg", "elytra", "emerald", "empty_armor_slot_boots", "empty_armor_slot_chestplate", "empty_armor_slot_helmet", "empty_armor_slot_leggings", "empty_armor_slot_shield", "enchanted_book", "ender_eye", "ender_pearl", "end_crystal", "experience_bottle", "feather", "fermented_spider_eye", "filled_map", "filled_map_markings", "firework_rocket", "firework_star", "firework_star_overlay", "fire_charge", "fishing_rod", "fishing_rod_cast", "flint", "flint_and_steel", "flower_banner_pattern", "flower_pot", "furnace_minecart", "ghast_tear", "glass_bottle", "glistering_melon_slice", "globe_banner_pattern", "glowstone_dust", "golden_apple", "golden_axe", "golden_boots", "golden_carrot", "golden_chestplate", "golden_helmet", "golden_hoe", "golden_horse_armor", "golden_leggings", "golden_pickaxe", "golden_shovel", "golden_sword", "gold_ingot", "gold_nugget", "gray_dye", "green_dye", "gunpowder", "heart_of_the_sea", "honeycomb", "honey_bottle", "hopper", "hopper_minecart", "ink_sac", "iron_axe", "iron_boots", "iron_chestplate", "iron_door", "iron_helmet", "iron_hoe", "iron_horse_armor", "iron_ingot", "iron_leggings", "iron_nugget", "iron_pickaxe", "iron_shovel", "iron_sword", "item_frame", "jungle_boat", "jungle_door", "jungle_sign", "kelp", "knowledge_book", "lantern", "lapis_lazuli", "lava_bucket", "lead", "leather", "leather_boots", "leather_boots_overlay", "leather_chestplate", "leather_chestplate_overlay", "leather_helmet", "leather_helmet_overlay", "leather_horse_armor", "leather_leggings", "leather_leggings_overlay", "light_blue_dye", "light_gray_dye", "lime_dye", "lingering_potion", "magenta_dye", "magma_cream", "map", "melon_seeds", "melon_slice", "milk_bucket", "minecart", "mojang_banner_pattern", "mushroom_stew", "music_disc_11", "music_disc_13", "music_disc_blocks", "music_disc_cat", "music_disc_chirp", "music_disc_far", "music_disc_mall", "music_disc_mellohi", "music_disc_pigstep", "music_disc_stal", "music_disc_strad", "music_disc_wait", "music_disc_ward", "mutton", "name_tag", "nautilus_shell", "netherite_axe", "netherite_boots", "netherite_chestplate", "netherite_helmet", "netherite_hoe", "netherite_ingot", "netherite_leggings", "netherite_pickaxe", "netherite_scrap", "netherite_shovel", "netherite_sword", "nether_brick", "nether_sprouts", "nether_star", "nether_wart", "oak_boat", "oak_door", "oak_sign", "orange_dye", "painting", "paper", "phantom_membrane", "piglin_banner_pattern", "pink_dye", "poisonous_potato", "popped_chorus_fruit", "porkchop", "potato", "potion", "potion_overlay", "prismarine_crystals", "prismarine_shard", "pufferfish", "pufferfish_bucket", "pumpkin_pie", "pumpkin_seeds", "purple_dye", "quartz", "rabbit", "rabbit_foot", "rabbit_hide", "rabbit_stew", "redstone", "red_dye", "repeater", "rotten_flesh", "ruby", "saddle", "salmon", "salmon_bucket", "scute", "seagrass", "sea_pickle", "shears", "shulker_shell", "skull_banner_pattern", "slime_ball", "snowball", "soul_campfire", "soul_lantern", "spawn_egg", "spawn_egg_overlay", "spectral_arrow", "spider_eye", "splash_potion", "spruce_boat", "spruce_door", "spruce_sign", "stick", "stone_axe", "stone_hoe", "stone_pickaxe", "stone_shovel", "stone_sword", "string", "structure_void", "sugar", "sugar_cane", "suspicious_stew", "sweet_berries", "tipped_arrow_base", "tipped_arrow_head", "tnt_minecart", "totem_of_undying", "trident", "tropical_fish", "tropical_fish_bucket", "turtle_egg", "turtle_helmet", "warped_door", "warped_fungus_on_a_stick", "warped_sign", "water_bucket", "wheat", "wheat_seeds", "white_dye", "wooden_axe", "wooden_hoe", "wooden_pickaxe", "wooden_shovel", "wooden_sword", "writable_book", "written_book", "yellow_dye"]
  const blocksEdu = ["chemical_heat", "compound_creator_inside", "compound_creator_inside_bottom", "compound_creator_side_a", "compound_creator_side_b", "compound_creator_side_c", "compound_creator_top", "element_000_unknown", "element_001_h", "element_002_he", "element_003_li", "element_004_be", "element_005_b", "element_006_c", "element_007_n", "element_008_o", "element_009_f", "element_010_ne", "element_011_na", "element_012_mg", "element_013_al", "element_014_si", "element_015_p", "element_016_s", "element_017_cl", "element_018_ar", "element_019_k", "element_020_ca", "element_021_sc", "element_022_ti", "element_023_v", "element_024_cr", "element_025_mn", "element_026_fe", "element_027_co", "element_028_ni", "element_029_cu", "element_030_zn", "element_031_ga", "element_032_ge", "element_033_as", "element_034_se", "element_035_br", "element_036_kr", "element_037_rb", "element_038_sr", "element_039_y", "element_040_zr", "element_041_nb", "element_042_mo", "element_043_tc", "element_044_ru", "element_045_rh", "element_046_pd", "element_047_ag", "element_048_cd", "element_049_in", "element_050_sn", "element_051_sb", "element_052_te", "element_053_i", "element_054_xe", "element_055_cs", "element_056_ba", "element_057_la", "element_058_ce", "element_059_pr", "element_060_nd", "element_061_pm", "element_062_sm", "element_063_eu", "element_064_gd", "element_065_tb", "element_066_dy", "element_067_ho", "element_068_er", "element_069_tm", "element_070_yb", "element_071_lu", "element_072_hf", "element_073_ta", "element_074_w", "element_075_re", "element_076_os", "element_077_ir", "element_078_pt", "element_079_au", "element_080_hg", "element_081_tl", "element_082_pb", "element_083_bi", "element_084_po", "element_085_at", "element_086_rn", "element_087_fr", "element_088_ra", "element_089_ac", "element_090_th", "element_091_pa", "element_092_u", "element_093_np", "element_094_pu", "element_095_am", "element_096_cm", "element_097_bk", "element_098_cf", "element_099_es", "element_100_fm", "element_101_md", "element_102_no", "element_103_lr", "element_104_rf", "element_105_db", "element_106_sg", "element_107_bh", "element_108_hs", "element_109_mt", "element_110_ds", "element_111_rg", "element_112_cn", "element_113_nh", "element_114_fl", "element_115_mc", "element_116_lv", "element_117_ts", "element_118_og", "element_constructor_back", "element_constructor_front", "element_constructor_side_a", "element_constructor_side_b", "element_constructor_top", "glow_stick_blue", "glow_stick_brown", "glow_stick_cyan", "glow_stick_gray", "glow_stick_green", "glow_stick_light_blue", "glow_stick_lime", "glow_stick_magenta", "glow_stick_orange", "glow_stick_pink", "glow_stick_purple", "glow_stick_red", "glow_stick_white", "glow_stick_yellow", "hard_glass", "hard_glass_black", "hard_glass_blue", "hard_glass_brown", "hard_glass_cyan", "hard_glass_gray", "hard_glass_green", "hard_glass_light_blue", "hard_glass_lime", "hard_glass_magenta", "hard_glass_orange", "hard_glass_pink", "hard_glass_purple", "hard_glass_red", "hard_glass_silver", "hard_glass_white", "hard_glass_yellow", "lab_table_bottom", "lab_table_front", "lab_table_side_a", "lab_table_side_b", "lab_table_side_c", "lab_table_top", "material_reducer_bottom", "material_reducer_front", "material_reducer_side", "material_reducer_top", "tnt_bottom_underwater", "tnt_side_underwater", "tnt_top_underwater", "torch_blue", "torch_green", "torch_purple", "torch_red", "torch_underwater"]
  const itemsEdu = ["balloon", "bleach", "compounds", "ice_bomb", "medicine_blindness", "medicine_nausea", "medicine_poison", "medicine_weakness", "rapid_fertilizer", "sparkler_blue", "sparkler_blue_off", "sparkler_green", "sparkler_green_off", "sparkler_orange", "sparkler_orange_off", "sparkler_purple", "sparkler_purple_off", "sparkler_red", "sparkler_red_off"]
  // return { type: itemId, path: 'bedrock/items/minecart_furnace' }  
  const sprite = window.sprites[itemId]
  // console.log(item)
  if (sprite) {
    return { type: itemId, path: 'invsprite', slice: [sprite.x, sprite.y, 32, 32], scale: 0.5 }
  } else if (items.includes(itemId)) {
    return { type: itemId, path: 'bedrock/items/' + itemId }
  } else if (blocks.includes(itemId)) {
    return { type: itemId, path: 'bedrock/blocks/' + itemId }
  } else if (itemsjava.includes(itemId)) {
    return { type: itemId, path: 'item/' + itemId }
  } else if (blocksEdu.includes(itemId)) {
    return { type: itemId, path: 'education/blocks/' + itemId }
  } else if (itemsEdu.includes(itemId)) {
    return { type: itemId, path: 'education/items/' + itemId }
  } else {
    for (const item of items) {
      if (item.startsWith(itemId)) {
        return { type: itemId, path: 'bedrock/items/' + item, fb: true }
      }
    }
    for (const item of blocks) {
      if (item.startsWith(itemId)) {
        return { type: itemId, path: 'bedrock/blocks/' + item, fb: true }
      }
    }
    console.warn('unknown item id:', itemId)
  }
}

const creativeMap = [
  ['tabBuilding', 'tab_building_blocks'],
  ['tabDecoration', 'tab_decorations'],
  ['tabRedstone', 'tab_redstone'],
  ['tabTransport', 'tab_transportation'],
  ['tabMisc', 'tab_misc'],
  ['tabFood', 'tab_food'],
  ['tabTools', 'tab_tools'],
  ['tabCombat', 'tab_combat'],
  ['tabBrewing', 'tab_brewing'],
  ['tabSurvival', 'tab_materials'],
]

class CreativeWindowManager {
  constructor(win, inv) {
    this.win = win
    this.inv = inv
    this.map = win.getWindowMap('bedrock')
    win.on('tabChange', this.onTabChange)
    win.on('itemEvent', (id, type, pos, data) => {
      console.log('itemEvent', id, type, pos, data)
      if (type == 'release') {
        this.onRelease()
      } else {
        const [containing, index] = data

        if (containing === 'bodyItems') {
          const item = this.win[containing][index]
          this.onCreativeEvent(type, item)
        } else {
          const { containerID, range } = this.map[containing]
          const slotIndex = range[0] + index
          const container = this.inv.getContainerFromSlotType(containerID)
          if (!container) return
          const item = container.slots[slotIndex]
          this.onInventoryEvent(type, containing, containerID, slotIndex, item)
        }
      }
    })
    win.on('scrollbarUpdate', this.onScrollbarUpdate)
  }

  waitForServerAck() {
    if (!this.inv.isWaitingForAck()) return false
    return new Promise((res, rej) => {
      let ticks = 0
      const timer = setInterval(() => {
        if (!this.inv.isWaitingForAck()) {
          clearInterval(timer)
          res()
          return
        }
        ticks++
        if (ticks > 20 && this.inv.isWaitingForAck()) {
          debugger
          this.win.can.displayBlockingMessage('Server did not respond to last transaction')
          clearInterval(timer)
          rej('timeout')
        }
      }, 50)
    })
  }

  renderItems(inv = this.inv) {
    for (const key in this.map) {
      const v = this.map[key]
      const [begin, end] = v.range
      const cont = inv.getContainerFromSlotType(v.containerID)
      if (cont) {
        this.win[key] = cont.slots.slice(begin, end != null ? end + 1 : undefined)
      }
    }
    this.win.floatingItem = this.inv.cursorItem
    this.win.needsUpdate = true
  }

  onTabChange = (now, old) => {
    const items = []
    const content = this.inv.creative
    console.log('Tab change contents', content)
    for (const itemId in content) {
      const val = content[itemId]
      for (const [our, their] of creativeMap) {
        if (now === our && val === their) {
          items.push({ type: itemId })
          break
        } else if (!val && now === 'tabSaved') {
          break
        }
      }
    }
    this.win.bodyItems = items
    this.win.needsUpdate = true

    this.renderItems()
  }

  onTransactionResponse = ok => {
    this.renderItems()
    if (!ok) {
      this.win.can.displayBlockingMessage('Server rejected the last transaction')
    }
  } 

  onCreativeEvent = async (type, item) => {
    if (type === 'click') {
      try { await this.waitForServerAck() } catch { return }
      this.inv.startTransactionGroup()
      if (this.inv.cursorItem) {
        this.inv.destroy('cursor', 0, this.inv.cursorItem.count)
      }
      // this.win.floatingItem = item
      // Pickup item from creative inventory
      this.inv.creativeCreate(item, 'cursor', 0, 64)
      this.inv.finishTransactionGroup(this.onTransactionResponse)
    }
  }

  onLeftClick(containerID, inventoryIndex, placeItem) {
    try { this.inv.startTransactionGroup() } catch { return }
    const cursorItem = this.inv.cursorItem
    if (cursorItem) { // have cursor item
      if (placeItem) { // swap
        if (placeItem.type == cursorItem.type) {
          this.inv.place('cursor', 0, containerID, inventoryIndex, Math.min(placeItem.freeSlots(), cursorItem.count))
        } else {
          this.inv.swap('cursor', 0, containerID, inventoryIndex)
        }
      } else { // place all (left clicking)
        this.inv.place('cursor', 0, containerID, inventoryIndex, this.inv.cursorItem.count)
      }
    } else if (placeItem) { // pick up
      this.inv.take(containerID, inventoryIndex, placeItem.count)
    }
    this.renderItems(this.inv.tx)
    this.inv.finishTransactionGroup(this.onTransactionResponse)
  }

  onRightClick(containerId, index, slot) {
    try { this.inv.startTransactionGroup() } catch { return }
    const floating = this.win.floatingItem
    if (floating) {
      if (slot) { // We are holding something + have something in the clicked slot
        if (slot.type === floating.type && slot.freeSlots() >= 1) {
          this.inv.place('cursor', 0, containerId, index, 1)
        } else {
          // we can't right click on this slot as there's something already there
        }
      } else { // slot is free
        this.inv.place('cursor', 0, containerId, index, 1)
      }
    } else if (slot) { // not holding anything, picking up
      this.inv.take(containerId, index, Math.ceil(slot.count / 2))
    }
    this.renderItems(this.inv.tx)
    this.inv.finishTransactionGroup(this.onTransactionResponse)
  }


  // Adds an item to a slot and returns how much was able to be added
  addToSlot(containerId, index, item, existingOnly = true) {
    const currentItem = this.inv.tx.get(containerId, index)
    if (currentItem) {
      if (currentItem.type !== item.type) return 0
      // const free = currentItem.stackSize - item.count
      const amountToAdd = Math.min(item.count, item.freeSlots())
      if (amountToAdd <= 0) return 0
      this.inv.place('cursor', 0, containerId, index, amountToAdd)
      item.count -= amountToAdd
      return amountToAdd
    } else if (!existingOnly) {
      this.inv.place('cursor', 0, containerId, index, item.count)
      item.count -= item.count
      return item.count
    }
    return 0
  }

  /**
   * 
   * @param {string} slotType - The type of ItemGrid for example the hotbar or armor bar or inventory. The variable used in layout window classes.
   * @param {number} inventoryIndex - The index in the Prismarine-Window slots sent over the network
   * @param {*} item - The item at the position of the `inventoryIndex`
   */
  onShiftClick(slotType, containerId, index, item) {
    if (!item) return
    // Shift click move item, TODO: handle edge cases:
    // if (type is armor) move to armor slot;
    // if (type is shield) move to shield slot;
    // else ...

    if (this.inv.cursorItem) {
      return // already have something in cursor, can't shift click
    }

    this.inv.startTransactionGroup()
    const shift = (to) => {
      this.inv.take(containerId, index, item.count)

      const map = this.map[to].range
      const slot = item.clone()
      // First, try to add to add the floating item to all the slots that match the floating item type
      for (let i = map[0]; i < map[1] && slot.count; i++) {
        this.addToSlot(containerId, i, slot, true)
      }
      // Then if we still have remaining items, add to any empty slot
      for (let i = map[0]; i < map[1] && slot.count; i++) {
        this.addToSlot(containerId, i, slot, false)
      }
    }

    if (slotType == 'hotbarItems') shift('inventoryItems')
    if (slotType == 'inventoryItems') shift('hotbarItems')
    this.renderItems(this.inv.tx)
    this.inv.finishTransactionGroup(this.onTransactionResponse)
  }

  onInventoryEvent = async (type, containing, containerID, inventoryIndex, item) => {
    console.log('InvEvent', type, containing, containerID, inventoryIndex, item, this.win._downKeys.has('ShiftLeft'))
    try { await this.waitForServerAck() } catch { return }
    const floating = this.win.floatingItem

    if (type === 'doubleclick' && floating && !item) {
      this.inv.startTransactionGroup()
      this.inv.takeAll(containerID, floating.type)
      this.inv.finishTransactionGroup(this.onTransactionResponse)
      this.renderItems()
    } else if (type == 'click' && this.win._downKeys.has('ShiftLeft')) {
      this.onShiftClick(containing, containerID, inventoryIndex, item)
    } else if (type === 'click' || type === 'rightclick') {
      // console.log('click with', this.win._downKeys)
      this[type == 'click' ? 'onLeftClick' : 'onRightClick'](containerID, inventoryIndex, item)
      this.mouseDown = type
      this.mouseDownFloat = this.win.floatingItem?.clone() // Backup of held item we start with
      this.mouseDownSlots = new Set([inventoryIndex])
      this.renderItems()
    } else if (type === 'hover' && containing === 'inventoryItems' || containing === 'hotbarItems') {
      if (floating && this.mouseDownFloat) {
        if (this.mouseDown == 'click') { // Left clicking
          // multi spread operation & slot is empty
          if (this.mouseDownSlots.has(inventoryIndex) || item) return
          this.mouseDownSlots.add(inventoryIndex)
          const dividend = Math.floor(this.mouseDownFloat.count / this.mouseDownSlots.size)
          if (!(dividend > 0)) return
          let accounted = this.mouseDownFloat.count
          this.inv.eraseTransaction()
          this.inv.startTransactionGroup()
          for (const slotIndex of this.mouseDownSlots) {
            this.inv.place('cursor', 0, containerID, slotIndex, dividend)
            // val.count = dividend
            accounted = accounted - dividend
          }
          // floating.count = accounted
          this.renderItems(this.inv.tx)
        } else if (this.mouseDown == 'rightclick') {
          // single spread operation
          if (this.mouseDownSlots.has(inventoryIndex)) return
          this.onRightClick(containerID, inventoryIndex, item)
          this.mouseDownSlots.add(inventoryIndex)
        }
      }
    }
    if (type == 'click') {

    }
  }

  onScrollbarUpdate = (id, type, pos, increment) => {
    const inc = Math.floor(increment.y / 10)
    this.win.$('bodyItems').ho = inc
  }

  onRelease() {
    this.inv.finishTransactionGroup(this.onTransactionResponse)
    this.mouseDown = false
    this.mouseDownSlots = null
    this.mouseDownFloat = null
  }
}

const clientInventory = new ClientInventory()
const serverInventory = new ServerInventory()
const cl = {
  tryCraftRecipe: id => true,
  tryCreateItem: (what, count) => {
    console.log('user wants to craft', what)
    const stackId = 2
    return new Item({ ...what, stackId, count })
  }
}

clientInventory.client = cl
serverInventory.client = cl

clientInventory.send = (packet) => {
  console.log('Client outbound', JSON.stringify(packet, null, 2))
  console.log('Clientbound')
  setTimeout(() => serverInventory.handle(packet), 100)
}
serverInventory.send = packet => {
  console.log('Client inbound', JSON.stringify(packet))
  clientInventory.handleResponse(packet)
}

function loadClientInv() {
  const openAll = invs => invs.forEach(inv => {
    serverInventory.open(inv.windowID, inv.windowType)
    clientInventory.open(inv.windowID, inv.windowType)

    clientInventory.update(inv.windowID, [])
    serverInventory.update(inv.windowID, [])
  })

  openAll([
    // The windowID is a sequential number linked to a window instance, windowType is a list from an enum
    { windowID: 'cursor', windowType: 'cursor' },

    { windowID: 'inventory', windowType: 'inventory' },
    { windowID: 'armor', windowType: 'armor' },
    { windowID: 'ui', windowType: 'hud' },
    { windowID: 'offhand', windowType: 'hand' }
  ])

  openAll(['cursor', 'hotbar_and_inventory', 'ui', 'armor', 'offhand', 'creative_output'])
  clientInventory.update('inventory', [new Item({ type: 'apple', count: 1 }), new Item({ type: 'arrow', count: 1 })])
  serverInventory.update('inventory', [new Item({ type: 'apple', count: 1 }), new Item({ type: 'arrow', count: 1 })])
}

loadClientInv()

window.pwindow = clientInventory

window.manager = new CreativeWindowManager(window.inventory, pwindow)

// setTimeout(() => {
// }, 2200)

fetch('../src/BedrockCreativeTabs.json')
  .then(response => response.json())
  .then(obj => { window.pwindow.creative = obj })

fetch('../src/invsprite.json')
  .then(response => response.json())
  .then(obj => { window.sprites = obj })