using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using LocalChatbotGUI.Services;

namespace LocalChatbotGUI
{
    public partial class MainWindow : Window
    {
        private readonly OllamaService _ollamaService;
        public ObservableCollection<ChatMessage> Messages { get; set; }

        public MainWindow()
        {
            InitializeComponent();
            _ollamaService = new OllamaService();
            Messages = new ObservableCollection<ChatMessage>();
            ChatList.ItemsSource = Messages;

            Messages.Add(new ChatMessage { IsUser = false, Content = "Hello! I am ready to chat." });
        }

        private async void OnSendClick(object sender, RoutedEventArgs e)
        {
            await SendMessage();
        }

        private async void InputBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                await SendMessage();
            }
        }

        private async Task SendMessage()
        {
            var text = InputBox.Text.Trim();
            if (string.IsNullOrEmpty(text)) return;

            // User Message
            Messages.Add(new ChatMessage { IsUser = true, Content = text });
            InputBox.Text = "";
            ScrollOutput.ScrollToEnd();

            // Bot "Thinking" placeholder
            var thinkingMsg = new ChatMessage { IsUser = false, Content = "Thinking..." };
            Messages.Add(thinkingMsg);
            ScrollOutput.ScrollToEnd();

            // Generate Response
            var response = await _ollamaService.GenerateResponseAsync(text);
            
            // Replace Thinking with Response
            Messages.Remove(thinkingMsg);
            Messages.Add(new ChatMessage { IsUser = false, Content = response });
            ScrollOutput.ScrollToEnd();
        }
    }

    public class ChatMessage
    {
        public bool IsUser { get; set; }
        public string Content { get; set; }
    }
}
