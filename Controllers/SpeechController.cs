

using System.IO;
using System.Threading.Tasks;
using Itminus.Azure.Speech;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.controllers{
    public class SpeechController: Controller{
        private SpeechService speechService;

        public SpeechController(SpeechService service){
            this.speechService = service;
        }

        [HttpPost]
        public async Task<IActionResult> STT(string language, string contentType, IFormFile audio){
            var audioStream = audio.OpenReadStream();
            var streamResult= await this.speechService.FetchTextAsStreamResultAsync(audioStream,contentType,language);
            return File(streamResult,"appliation/json");
        }

        [HttpPost]
        public async Task<IActionResult> TTS(string text, string voiceName){
            var stream= await this.speechService.FetchSpeechAsync(text,voiceName);
            return File(stream,"application/octet-stream","aaa.wav");
        }
    }
}