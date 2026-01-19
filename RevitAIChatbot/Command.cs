using System;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using RevitAIChatbot.Views;

namespace RevitAIChatbot
{
    [Transaction(TransactionMode.Manual)]
    public class Command : IExternalCommand
    {
        public static ExternalCommandData CachedCommandData { get; set; }
        public static ChatWindow MainWindow { get; set; }

        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            CachedCommandData = commandData;

            if (MainWindow == null || !MainWindow.IsLoaded)
            {
                MainWindow = new ChatWindow(commandData);
                MainWindow.Show();
            }
            else
            {
                MainWindow.Activate();
            }

            return Result.Succeeded;
        }
    }
}
