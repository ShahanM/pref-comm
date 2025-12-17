export const mapKeyContainsAll = <T>(mapA: Map<T, unknown>, arrayLike: T[]) => {
	for (const item of arrayLike) {
		if (!mapA.has(item)) {

			return false;
		}
	}
	return true;
}

export function shuffleArray<T>(array: T[]): T[] {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}
	return shuffledArray;
}

// interface ReplaceCallback {
// 	(item: Object): Object;
// }

// export function mapReplace(array: Map<K, V>, prop: string, propval: any, callback: ReplaceCallback): Object[] {
// 	return array.map((item: Object) => {
// 		if (prop in item && (item as any)[prop] === propval) {
// 			return callback(item);
// 		} else {
// 			return item;
// 		}
// 	});
// }