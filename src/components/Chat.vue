<template>
  <div class="chat-container">
    <div class="messages" v-if="messages.length > 0">
      <div
        class="message"
        :class="message.isBot ? 'bot' : 'user'"
        v-for="message in messages"
      >
        <span :class="message.timestamp"></span>
        {{ message.text }}
      </div>
    </div>
    <div class="input-container">
      <input type="text" v-model="newMessage" @keypress="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { DeepSeekClient } from "../api/deepseek";

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim()) {
        this.messages.push({
          text: this.newMessage,
          timestamp: new Date().toLocaleTimeString(),
          isBot: false,
        });
        this.newMessage = "";
        await this.sendToDeepSeek();
      }
    },
    async sendToDeepSeek() {
      try {
        const response = await DeepSeekClient.getInstance().sendRequest(
          this.messages[this.messages.length - 1].text
        );
        this.messages.push({
          text: response,
          timestamp: new Date().toLocaleTimeString(),
          isBot: true,
        });
      } catch (error) {
        this.messages.push({
          text: `Error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
          isBot: true,
        });
      }
    },
  },
};
</script>
