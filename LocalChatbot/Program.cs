using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var httpClient = new HttpClient();
string modelName = "qwen2.5-coder:32b";
string apiUrl = "http://localhost:11434/api/chat";

Console.WriteLine($"Ref: Connected to {modelName} at {apiUrl}");
Console.WriteLine("Type your message and press Enter. (Type 'exit' to quit)");

while (true)
{
    Console.Write("\nYou: ");
    var input = Console.ReadLine();

    if (string.IsNullOrWhiteSpace(input)) continue;
    if (input.Trim().ToLower() == "exit") break;

    Console.Write("Bot: ");

    var request = new
    {
        model = modelName,
        messages = new[]
        {
            new { role = "user", content = input }
        },
        stream = true
    };

    var jsonInput = JsonSerializer.Serialize(request);
    var content = new StringContent(jsonInput, Encoding.UTF8, "application/json");

    try
    {
        using var response = await httpClient.PostAsync(apiUrl, content);
        response.EnsureSuccessStatusCode();

        using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line)) continue;

            try
            {
                var chunk = JsonSerializer.Deserialize<OllamaResponse>(line);
                if (chunk?.Message != null)
                {
                    Console.Write(chunk.Message.Content);
                }
                
                if (chunk?.Done == true)
                {
                    // Response complete
                }
            }
            catch (JsonException)
            {
                // Ignore parsing errors for partial lines if any
            }
        }
        Console.WriteLine(); 
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nError: {ex.Message}");
    }
}

public class OllamaResponse
{
    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [JsonPropertyName("created_at")]
    public string? CreatedAt { get; set; }

    [JsonPropertyName("message")]
    public OllamaMessage? Message { get; set; }

    [JsonPropertyName("done")]
    public bool Done { get; set; }
}

public class OllamaMessage
{
    [JsonPropertyName("role")]
    public string? Role { get; set; }

    [JsonPropertyName("content")]
    public string? Content { get; set; }
}
