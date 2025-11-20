import React from "react";
import Logo from "../assets/Logo.png";
import { 
  Container, 
  Hero,
  HeroTop,
  HeroText, 
  LogoImage,
  Tagline, 
  Description, 
  ButtonGroup, 
  Features, 
  FeatureCard 
} from "../styles/LandingStyle";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
        <Container>
        <Hero>
          <HeroTop>
            <LogoImage src={Logo} alt="Classcade Logo" />
            <HeroText>
              <h1>Classcade</h1>
              <Tagline>where student teams flow</Tagline>
            </HeroText>
          </HeroTop>
      
          <Description>
            Classcade is the ultimate project management tool built for student teams. 
            Organize tasks, collaborate with peers and instructors, and achieve the ultimate project synergy!
          </Description>
      
          <ButtonGroup>
            <PrimaryButton 
              text="Create Your Account" 
              onClick={() => navigate("/signup")} 
            />
            <PrimaryButton 
              text="Log In" 
              onClick={() => navigate("/login")} 
            />
          </ButtonGroup>
        </Hero>
      
        <Features> 
          <FeatureCard> 
            <h2>🚀 Fast Collaboration</h2>
            <p>Chat, assign tasks, and track time instantly!</p>
          </FeatureCard>
          <FeatureCard>
            <h2>🎯 Smart Task Management</h2>
            <p>Stay on track with intuitive boards, deadlines, and progress tracking!</p>
          </FeatureCard>
          <FeatureCard>
            <h2>🌟 Designed for Students</h2>
            <p>Simple, fun, and powerful enough to handle any project!</p>
          </FeatureCard>
        </Features>
      </Container>
  
  );
};

export default Landing;
