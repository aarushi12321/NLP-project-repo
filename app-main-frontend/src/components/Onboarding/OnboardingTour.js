import Joyride from "react-joyride";

const OnboardingTour = ({ run }) => {
  const steps = [
    {
      target: ".onboarding-button",
      content:
        "Hello! I am AVA, your very own sci-bot. Before you begin asking me questions, would you like to start a tour?",
      disableBeacon: true,
    },
    {
      target: ".history-toggle-button",
      content:
        "Incase you want to revisit the questions that you asked me, you can click here to see our chat history.",
      disableBeacon: true,
    },
    {
      target: ".settings-toggle-button",
      content:
        "I understand how tedious it must be asking me the same questions again and again to get the response that you like. Customize it so that I know what you want! ",

      disableBeacon: true,
    },
    {
      target: ".summary-feature-button",
      content:
        "Get a summarized view of your last 10 chats by clicking here. See the amazing wordclouds that I drew.",

      disableBeacon: true,
    },
    {
      target: ".book-recommender-feature-button",
      content:
        "Want book recommendations? Click here to find books based on our recent conversations!",

      disableBeacon: true,
    },
    {
      target: ".quiz-me-feature-button",
      content:
        "Do you have an upcoming test or just want to see how much you learnt ? Start a quiz based on our current chat",

      disableBeacon: true,
    },
    {
      target: ".chat-input-form",
      content: "Have some science questions? Let's chat. Type away!",

      disableBeacon: true,
    },
  ];
  return (
    <div>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
        locale={{ last: "Finish" }}
      />
    </div>
  );
};

export default OnboardingTour;
