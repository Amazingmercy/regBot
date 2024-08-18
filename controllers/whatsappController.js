const { handleFacultySelection, handleNextStep, handleEndCoversation, handleGreeting, getUserState} = require('../services/whatsappServices');
const setupNlp = require('../nlp')


const verifyWebhook = async () => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN

  console.log('Query object:', req.query);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`Received webhook verification request: mode=${mode}, token=${token}, challenge=${challenge}`);

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log(challenge)
  } else {
    res.sendStatus(403)
    console.log("Unauthorized")
  }

}

const handleIncomingMessages = async (req, res) => {
    try {
      const incomingMessageMain = req.body.entry[0].changes[0].value.messages[0].text.body;
      const incomingMessage = incomingMessageMain.toLowerCase();
      const from = req.body.entry[0].changes[0].value.messages[0].from;

      const manager = await setupNlp();
  
      const response = await manager.process('en', incomingMessage);
      
      const userState = await getUserState(from);
  
      if (response.intent === 'greeting') {
        await handleGreeting(res, from, response);
      } else if (response.intent === 'faculty_name') {
        await handleFacultySelection(res, from, response, userState, incomingMessage);
      } else if (response.intent === 'next_stage') {
        await handleNextStep(res, from, response, userState);
      } else if (response.intent === 'end_conversation') {
        await handleEndCoversation(res, from, response);
      } else {
        await sendMessage(res, from, 'Sorry, I did not understand that.');
      }
  
    } catch (error) {
      console.log('Error handling incoming message:', error);
      res.status(500).json({ message: 'Error handling incoming message' });
    }
  };
  
  


module.exports = {
    verifyWebhook,
    handleIncomingMessages,

}