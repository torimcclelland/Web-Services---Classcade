import React from "react";
import { Container, Hero, Tagline, Description, CTAButton, Features, FeatureCard } from "./LandingStyle";

const Landing = () => {
  return (
    <Container>
      <Hero>
        <h1>Classcade</h1>
        <Tagline>where student teams flow</Tagline>
        <Description>
          Classcade is the ultimate project management tool built for student teams. 
          Organize tasks, collaborate seamlessly, and bring your ideas to life with 
          a platform designed to make teamwork effortless and exciting.
        </Description>
        <CTAButton>Create Your Account</CTAButton>
      </Hero>

      <Features>
        <FeatureCard>
          <h2>🚀 Fast Collaboration</h2>
          <p>Chat, share files, and assign tasks instantly so your team never misses a beat.</p>
        </FeatureCard>
        <FeatureCard>
          <h2>🎯 Smart Task Management</h2>
          <p>Stay on track with intuitive boards, deadlines, and progress tracking tailored for students.</p>
        </FeatureCard>
        <FeatureCard>
          <h2>🌟 Designed for Students</h2>
          <p>Built with your campus life in mind—simple, fun, and powerful enough to handle any project.</p>
        </FeatureCard>
      </Features>
    </Container>
  );
};

export default Landing;
