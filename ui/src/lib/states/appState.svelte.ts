import { MessageType, type Pal, type Player, type SaveFile } from "$types";
import { getSocketState } from "./websocketState.svelte";
import { palsData } from "$lib/data/pals";

const ws = getSocketState();

export function createAppState() {
	let players: Record<string, Player> = $state({});
	let selectedPlayerUid: string = $state("");
	let selectedPlayer: Player | null = $state(null);
	let selectedPalId: string = $state("");
	let selectedPal: Pal | null = $state(null);
	let saveFile: SaveFile | null = $state(null);
	let modifiedPals: Record<string, Pal> = $state({});

	function setPlayers(newPlayers: Record<string, Player>) {
		Object.entries(newPlayers).forEach(([key, player]) => {
			try {
				if (player.pals) {
					Object.values(player.pals).forEach(async pal => {
						const palInfo = await palsData.getPalInfo(pal.character_id);
						if (!palInfo) {
							console.error(`Failed to find pal info for`, pal);
						}
						pal.name = palInfo?.localized_name || pal.character_id;
						pal.elements = palInfo?.elements || [];
					});
				}

				players[key] = player;
			} catch (error) {
				console.error(`Failed to parse player data for key ${key}:`, error);
			}
		});
	}

	function setSelectedPal(pal: Pal | null) {
		selectedPal = pal;
		if (pal) {
			modifiedPals[pal.instance_id] = pal;
		}
	}

	function handlePalSelect(palId: string) {
		selectedPalId = palId;
		if (modifiedPals[palId]) {
			setSelectedPal(modifiedPals[palId]);
		} else {
			const data = {
				type: MessageType.GET_PAL_DETAILS,
				data: palId
			};
			ws.send(JSON.stringify(data));
		}
	}

	return {
		get players() { return players; },
		set players(newPlayers: Record<string, Player>) { setPlayers(newPlayers); },

		get selectedPlayerUid() { return selectedPlayerUid; },
		set selectedPlayerUid(uid: string) { selectedPlayerUid = uid; },

		get selectedPlayer() { return selectedPlayer as Player; },
		set selectedPlayer(player: Player) { selectedPlayer = player; },

		get selectedPalId() { return selectedPalId; },
		set selectedPalId(palId: string) { handlePalSelect(palId); },

		get selectedPal() { return selectedPal; },
		set selectedPal(pal: Pal | null) { setSelectedPal(pal); },

		get saveFile() { return saveFile; },
		set saveFile(file: SaveFile | null) { saveFile = file; },

		get modifiedPals() { return modifiedPals; }
	}
}

let appState: ReturnType<typeof createAppState>;

export function getAppState() {
	if (!appState) {
		appState = createAppState();
	}
	return appState;
}