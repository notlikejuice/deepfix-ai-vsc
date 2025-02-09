<template>
  <div class="chat-container">
    <div class="messages" v-if="messages.length > 0">
      <div class="message" :class="message.isBot ? 'bot' : 'user'" v-for="message in messages">
        <span :class="message.timestamp"></span>
        {{ message.text }}
      </div>
    </div>
    <div class="input-container">
      <input type="text" v-model="newMessage" @keypress="sendMessage">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      newMessage: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        this.messages.push({
          text: this.newMessage,
          timestamp: new Date().toLocaleTimeString(),
          isBot: false
        });
        this.newMessage = '';
        this.sendToAPI();
      }
    }
  }
}
</script>
