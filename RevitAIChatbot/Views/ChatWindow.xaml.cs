using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using Autodesk.Revit.UI;
using RevitAIChatbot.Services;

namespace RevitAIChatbot.Views
{
    public partial class ChatWindow : Window
    {
        private readonly ExternalCommandData _commandData;
        private readonly OllamaService _ollamaService;
        private readonly RevitScriptRunner _scriptRunner;
        private string _lastGeneratedCode;

        public ChatWindow(ExternalCommandData commandData)
        {
            InitializeComponent();
            _commandData = commandData;
            _ollamaService = new OllamaService();
            _scriptRunner = new RevitScriptRunner();

            AddMessage("System", "Ready. Ask me to perform a task.");
        }

        private async void OnSendClick(object sender, RoutedEventArgs e)
        {
            await SendMessage();
        }

        private async void InputBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter && (Keyboard.Modifiers & ModifierKeys.Shift) == 0)
            {
                e.Handled = true;
                await SendMessage();
            }
        }

        private async Task SendMessage()
        {
            var text = InputBox.Text.Trim();
            if (string.IsNullOrEmpty(text)) return;

            AddMessage("You", text);
            InputBox.Text = "";
            ActionPanel.Visibility = Visibility.Collapsed;

            var systemPrompt = @"You are a Revit API expert. 
If asked to write code, provide C# code compatible with Revit 2025 using the Roslyn Scripting API.
- You have access to 'Doc' (Document) and 'UIDoc' (UIDocument) globals.
- DO NOT wrap code in a class or void method unless you call it at the end.
- WRITE TOP-LEVEL STATEMENTS (Sequential code) for immediate execution.
- ALWAYS wrap your code in ```csharp blocks.";

            AddMessage("Bot", "Thinking...");
            // Simple placeholder removal
            var loadingMsg = ChatHistory.Children[ChatHistory.Children.Count - 1] as TextBlock;

            string response = await _ollamaService.GenerateResponseAsync(systemPrompt, text);
            
            // Remove loading
            ChatHistory.Children.Remove(loadingMsg);
            AddMessage("Bot", response);

            // Check for code
            var match = Regex.Match(response, @"```csharp(.*?)```", RegexOptions.Singleline);
            if (match.Success)
            {
                var code = match.Groups[1].Value.Trim();
                CodeEditor.Text = code;
                ActionPanel.Visibility = Visibility.Visible;
            }
        }

        private async void OnRunScriptClick(object sender, RoutedEventArgs e)
        {
            var codeToRun = CodeEditor.Text;
            if (string.IsNullOrEmpty(codeToRun)) return;

            AddMessage("System", "Executing script...");
            string result = await _scriptRunner.RunScriptAsync(codeToRun, _commandData);
            AddMessage("System", result);
        }

        private void AddMessage(string role, string content)
        {
            var textBlock = new TextBlock
            {
                Text = $"{role}: {content}",
                TextWrapping = TextWrapping.Wrap,
                Margin = new Thickness(0, 5, 0, 5),
                Padding = new Thickness(5),
                Background = role == "You" ? Brushes.LightBlue : Brushes.WhiteSmoke
            };
            ChatHistory.Children.Add(textBlock);
            ScrollOutput.ScrollToEnd();
        }
    }
}
