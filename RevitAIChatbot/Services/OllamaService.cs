using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RevitAIChatbot.Services
{
    public class OllamaService
    {
        private readonly HttpClient _httpClient;
        private const string ModelName = "qwen2.5-coder:32b";
        private const string ApiUrl = "http://localhost:11434/api/chat";

        public OllamaService()
        {
            _httpClient = new HttpClient();
            _httpClient.Timeout = TimeSpan.FromMinutes(5); // Long timeout for generation
        }

        public async Task<string> GenerateResponseAsync(string systemPrompt, string userPrompt)
        {
            var requestObj = new
            {
                model = ModelName,
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user", content = userPrompt }
                },
                stream = false // Non-streaming for simpler parsing for now
            };

            var json = JsonSerializer.Serialize(requestObj);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(ApiUrl, content);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<OllamaResponse>(responseString);
                
                return $"[Model: {result?.Model}]\n{result?.Message?.Content}" ?? "Error: No response content.";
            }
            catch (Exception ex)
            {
                return $"Error contacting Ollama: {ex.Message}";
            }
        }
    }

    public class OllamaResponse
    {
        [JsonPropertyName("model")]
        public string Model { get; set; }

        [JsonPropertyName("message")]
        public OllamaMessage Message { get; set; }
    }

    public class OllamaMessage
    {
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}
