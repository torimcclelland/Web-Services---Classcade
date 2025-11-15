import styled from "styled-components";

export const Container = styled.div`
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Hero = styled.div`
  margin-top: 80px;
  max-width: 800px;
  padding: 20px;

  h1 {
    font-size: 4rem;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #ff8a00, #e52e71);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Tagline = styled.h2`
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: #ffe082;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

export const CTAButton = styled.button`
  background: #ff8a00;
  color: #fff;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e52e71;
    transform: scale(1.05);
  }
`;

export const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 60px;
  gap: 30px;
  max-width: 1000px;
`;

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  width: 280px;
  transition: transform 0.3s ease, background 0.3s ease;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #ffe082;
  }

  p {
    font-size: 1rem;
    line-height: 1.4;
  }

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.2);
  }
`;
