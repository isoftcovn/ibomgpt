class EmojiManager {
    private static instance: EmojiManager;
    private emojiDictionary: {[key: string]: string};

    private constructor() {
        this.emojiDictionary = {
            smile: '😊',
            laugh: '😆',
            heart: '❤️',
            suprised: '😮',
            thumbs_up: '👍',
            cry: '😢',
            angry: '😡',
            // Add more emoji mappings here
        };
    }

    public static getInstance(): EmojiManager {
        if (!EmojiManager.instance) {
            EmojiManager.instance = new EmojiManager();
        }
        return EmojiManager.instance;
    }

    public getEmoji(emojiId: string): string | undefined {
        return this.emojiDictionary[emojiId];
    }
}

export default EmojiManager;
