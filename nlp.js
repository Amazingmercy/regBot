const { dockStart } = require('@nlpjs/basic');


const setupNlp = async () => {
  const dock = await dockStart({ use: ['Basic'] });
  const manager = dock.get('nlp');

  manager.addLanguage('en');

  const greeting = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 
    'good day', 'howdy', 'hi there', 'what\'s up', 'how are you', 
    'how\'s it going', 'greetings',
  ]


  for (const intent of greeting) {
    manager.addDocument('en', intent, 'greeting');
  }

   // Faculty selection intent
   const faculties = [
    'engineering', 'business', 'medicine', 'law', 'arts', 'science',
    'computing', 'I\'m interested in', 'I\'d like to study', 'social science',
  ];

  for (const intent of faculties) {
    manager.addDocument('en', intent, 'faculty_name');
  }

   // Next step intent
   const nextSteps = [
    'what\'s next', 'next step', 'what now', 'what should I do now',
    'continue', 'proceed', 'move forward', 'what\'s the next step','I\'m done with that, what is the next step'
  ];
  for (const intent of nextSteps) {
    manager.addDocument('en', intent, 'next_stage');
  }

  // End conversation intent
  const endConversation = [
    'bye', 'goodbye', 'see you later', 'thanks for your help',
    'that\'s all', 'I\'m done', 'thank you', 'thanks', 'exit'
  ];
  for (const intent of endConversation) {
    manager.addDocument('en', intent, 'end_conversation');
  }

  // Answers for Greetings
  manager.addAnswer('en', 'greeting', 'Hello, Please provide your Faculty');
  manager.addAnswer('en', 'greeting', 'Hey there, Enter your faculty name');
  manager.addAnswer('en', 'greeting', 'Hi, To proceed enter your faculty name');
  
  
  // Answers for Faculty name
  manager.addAnswer('en', 'faculty_name', 'Great choice! Let\'s start with the first step for ');
  manager.addAnswer('en', 'faculty_name', 'Excellent! Here\'s the first step for registering in ');

  // Answers for Next step

  manager.addAnswer('en', 'next_stage', 'Sure, here\'s the next step: ');
  manager.addAnswer('en', 'next_stage', 'Moving on to the next step: ');
  manager.addAnswer('en', 'next_stage', 'Alright, here is what to do next');
  
  //Answers for end Conversation


  manager.addAnswer('en', 'end_conversation', 'Thank you for using our registration service. Goodbye!');
  manager.addAnswer('en', 'end_conversation', 'I hope I was helpful. Have a great day!');


  await manager.train();
  manager.save(); // Save the model after training

  
  return manager;
};

module.exports = setupNlp;
