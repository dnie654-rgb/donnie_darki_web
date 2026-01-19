using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;

namespace RevitAIChatbot.Services
{
    public class ScriptGlobals
    {
        public Document Doc { get; set; }
        public UIDocument UIDoc { get; set; }
    }

    public class RevitScriptRunner
    {
        public async Task<string> RunScriptAsync(string code, ExternalCommandData commandData)
        {
            var options = ScriptOptions.Default
                .AddReferences(
                    typeof(object).Assembly, // System.Private.CoreLib
                    typeof(System.Linq.Enumerable).Assembly,
                    typeof(Element).Assembly, // RevitAPI
                    typeof(TaskDialog).Assembly // RevitAPIUI
                )
                .AddImports(
                    "System",
                    "System.Linq",
                    "System.Collections.Generic",
                    "Autodesk.Revit.DB",
                    "Autodesk.Revit.UI",
                    "Autodesk.Revit.ApplicationServices"
                );

            var globals = new ScriptGlobals
            {
                Doc = commandData.Application.ActiveUIDocument.Document,
                UIDoc = commandData.Application.ActiveUIDocument
            };

            try
            {
                // Roslyn Scripting
                var state = await CSharpScript.RunAsync(code, options, globals: globals);
                
                if (state.ReturnValue != null)
                {
                    return $"Success. Return value: {state.ReturnValue}";
                }
                return "Script executed successfully (no return value).";
            }
            catch (CompilationErrorException ce)
            {
                return "Compilation Error:\n" + string.Join("\n", ce.Diagnostics.Select(d => d.GetMessage()));
            }
            catch (Exception ex)
            {
                return $"Runtime Error: {ex.Message}\n{ex.StackTrace}";
            }
        }
    }
}
