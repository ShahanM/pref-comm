import cow from "./assets/cow.jpeg";
import duck from "./assets/duck.jpeg";
import elephant from "./assets/elephant.jpeg";
import fox from "./assets/fox.jpeg";
import llama from "./assets/llama.jpeg";
import tiger from "./assets/tiger.jpeg";
import zebra from "./assets/zebra.jpeg";
import { Avatar } from "./Advisor.types";

type AvatarMap = {
	[key: string]: Avatar;
}

export const AVATARS: AvatarMap = {
	cow: {
		src: cow,
		alt: 'Anonymous Cow',
		name: 'Anonymous Cow'
	},
	duck: {
		src: duck,
		alt: 'Anonymous Duck',
		name: 'Anonymous Duck'
	},
	elephant: {
		src: elephant,
		alt: 'Anonymous Elephant',
		name: 'Anonymous Elephant'
	},
	zebra: {
		src: zebra,
		alt: 'Anonymous Zebra',
		name: 'Anonymous Zebra'
	},
	llama: {
		src: llama,
		alt: 'Anonymous Llama',
		name: 'Anonymous Llama'
	},
	fox: {
		src: fox,
		alt: 'Anonymous Fox',
		name: 'Anonymous Fox'
	},
	tiger: {
		src: tiger,
		alt: 'Anonymous Tiger',
		name: 'Anonymous Tiger'
	}
}