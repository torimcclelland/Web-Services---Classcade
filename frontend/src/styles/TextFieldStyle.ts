.wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #1e3a8a;
}

.inputContainer {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  transition: border-color 0.2s ease;
}

.inputContainer:focus-within {
  border-color: #1e3a8a;
}

.icon {
  margin-right: 0.5rem;
  color: #1e3a8a;
  font-size: 1rem;
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
  color: #333;
}
