type ChatFormProps = {
  userInput: string;
  setUserInput: (v: string) => void;
  handleSubmit: () => void;
  disabled?: boolean;
};

export function ChatForm({
  userInput,
  setUserInput,
  handleSubmit,
  disabled,
}: ChatFormProps) {
  return (
    <form
      className="chat-form"
      onSubmit={(event) => {
        event.preventDefault();

        handleSubmit();
      }}
    >
      <input
        id="user-input"
        name="user-input"
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}
