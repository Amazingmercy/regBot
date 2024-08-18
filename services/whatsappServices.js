const UserState = require('../models/userStateModel')
const RegStep = require('../models/regStepModel');
require('dotenv').config()
const axios = require('axios');

const sendMessage = async (res, recipient, message) => {
    try {
        await axios.post(
            `${process.env.WHATSAPP_API_URL}`,
            {
                messaging_product: 'whatsapp',
                to: recipient,
                type: "text",
                text: { body: message },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                },
            }
        );
        console.log('Message sent successfully:', message);
        res.status(200).json({ botResponse: message })
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};


const getUserState = async (sender) => {
    let userState = await UserState.findOne({ userPhoneNumber: sender });
    if (!userState) {
        await UserState.create({
            userPhoneNumber: sender,
        })
        userState = await UserState.findOne({ userPhoneNumber: sender });
    }

   
    return userState

}


const handleFacultySelection = async (res, sender, response, userState, userFaculty) => {
    // Fetch the registration steps for the selected faculty
    const registrationSteps = await RegStep.findOne({ faculty: new RegExp(`^${userFaculty}$`, 'i') });
    console.log(userState)
    
    if (registrationSteps) {
        // Update userState directly in the database
        await UserState.updateOne(
            { userPhoneNumber: userState.userPhoneNumber }, // Find the document by phone number or unique identifier
            {
                $set: {
                    userFaculty: userFaculty,
                    currentStep: 0
                }
            }
        );

        // Prepare the response message
        let responseMessage = response.answer;
        responseMessage += `${userFaculty}: ${registrationSteps.steps[0]}`;

        // Send the response to the user
        await sendMessage(res, sender, responseMessage);
    } else {
        // Handle case where faculty is not recognized
        await sendMessage(res, sender, "Sorry, I don't recognize that faculty. Please enter the Faculty name again.");
    }
};




const handleNextStep = async (res, sender, response, userState) => {
    // Fetch the registration steps for the user's faculty
    const registrationSteps = await RegStep.findOne({ faculty: userState.userFaculty });
    
    // Increment the current step directly in the database
    await UserState.updateOne(
        { userPhoneNumber: userState.userPhoneNumber }, // Find the document by phone number or unique identifier
        { $inc: { currentStep: 1 } } // Increment the currentStep field by 1
    );

    // Retrieve the updated user state
    const updatedUserState = await UserState.findOne({ userPhoneNumber: userState.userPhoneNumber });
    console.log(updatedUserState.currentStep)
    
    // Check if there are more steps left
    if (updatedUserState.currentStep < registrationSteps.steps.length) {
        let responseMessage = response.answer;
        responseMessage += `\n${registrationSteps.steps[updatedUserState.currentStep]}`;
        await sendMessage(res, sender, responseMessage);
    } else {
        // All registration steps completed
        await sendMessage(res, sender, "Congratulations! You've completed all registration processes.");
    }
};


const handleEndCoversation = async (res, sender, response) => {
    try {
        const responseMessage = response.answer;
        await sendMessage(res, sender, responseMessage);
    } catch (error) {
        await sendMessage(res, sender, 'There was an error processing your request. Please try again later.');
    }
}

const handleGreeting = async (res, sender, response) => {
    try {
        let responseMessage = response.answer;
        await sendMessage(res, sender, responseMessage);
    } catch (error) {
        await sendMessage(res, sender, 'There was an error processing your request. Please try again later.');
    }
}

const handleMessage = async (sender, message) => {
    let userState = await getUserState(sender);
    const lowerMessage = message.trim().toLowerCase();

    if (!userState.faculty) {
        return await handleFacultySelection(userState, lowerMessage);
    } else if (lowerMessage === 'what\'s next?') {
        return await this.handleNextStep(userState);
    } else {
        return 'I didn\'t understand that. You can say "What\'s next?" to get the next step.';
    }

}


module.exports = {
    getUserState,
    handleNextStep,
    handleFacultySelection,
    handleMessage,
    handleEndCoversation,
    handleGreeting
}

