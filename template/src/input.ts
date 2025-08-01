// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting
import { exampleHelper } from './library';
import type { HookParams, HookReturn } from 'ai-dungeon-sdk';

// Every script needs a modifier function
export function modifier({ text }: HookParams): HookReturn {
    // What can you do with a script?

    // You can use log or console.log 
    // log('Hello World')
    // console.log('Hello World')

    // You can read the current text
    // This is the text that would otherwise be sent to the AI model
    // log(text)

    // You can read the current history
    // log(history)

    // You can use state to store information between turns
    // log(state)
    // state.example = 'Hello World!'

    // You can update the memory
    // state.memory.context = 'Hello Memory!'

    // You can update the authors note
    // state.memory.authorsNote = 'Hello Authors Note!'

    // You can display messages to the player
    // state.message = 'Hello Player!'

    // You can read the current story cards
    // log(storyCards)

    // You can add a story card
    // addStoryCard('exampleKey', 'exampleEntry', 'exampleType')

    // You can remove a story card
    // removeStoryCard(0)

    // You can update a story card
    // updateStoryCard(0, 'exampleKey', 'exampleEntry', 'exampleType')

    // You can read additional information from the current info.
    // info.actionCount is the number of actions in the adventure so far.
    // info.characterNames is an array of the character names for multiplayer adventures.
    // info.memoryLength (deprecated) is the length of the memory section of text.
    // info.contextTokens is the number of context tokens available.
    // info.maxChars is the maximum length that text can be. The server will truncate the text you return to this length.
    // log(info)  

    // You can change the player's context text
    // const newText = 'I see you...'
    // return { text: newText }

    // You can stop the action from proceeding
    // return { stop: true }

    // You can let the action proceed as normal
    return { text: exampleHelper(text) };
}
