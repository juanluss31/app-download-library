import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root"
})
export class PdfmergeService {
  constructor(private electronService: ElectronService) {}

  pdfMerge(inputFiles, outputFile) {
    return new Promise((resolve, reject) => {
      // The error object
      let error = {
        message: "",
        code: 0
      };
      // Set outputFile to 'out.pdf' if it's not defined
      outputFile = outputFile || "out.pdf";
      // Require child_process module to access spawn and execFile functions
      let { spawn } = this.electronService.childProcess;
      // Require the default NodeJS path module
      let path = this.electronService.path;
      // initialize the array of arguments to be passed to pdfmerge.py
      let pythonPath: string = "";
      // pythonPath = path.join("dist", "pdfmerge.py");
      pythonPath = path.join(
        path.dirname(__dirname),
        "..",
        "src",
        "extraResources",
        "pdfmerge.py"
      );

      // const args = process.argv.slice(1);
      // const serve = args.some(val => val === "--serve");

      // console.log(args);
      // console.log(serve);
      // if (serve) {
      //   pythonPath = path.join(__dirname + ".unpack", "dist", "pdfmerge.py");
      //   console.log("serve", pythonPath);
      // } else {
      //   pythonPath = path.join(process.resourcesPath, "pdfmerge.py");
      //   console.log("app", pythonPath);
      // }

      let argumentsArray = ["-3", pythonPath];
      // let argumentsArray = [
      //   path.join(
      //     this.electronService.remote.app.getAppPath(),
      //     "/dist",
      //     "/pdfmerge.py"
      //   )
      // ];
      // console.log(
      //   path.join(
      //     this.electronService.remote.app.getAppPath(),
      //     "/dist",
      //     "/pdfmerge.py"
      //   )
      // );

      // Push inputFiles to argumentsArray
      for (let i = 0; i < inputFiles.length; i++) {
        argumentsArray.push(inputFiles[i]);
      }
      // Push '-o' to the argumentsArray, -o = output file
      argumentsArray.push("-o");
      // Push the specified output file to argumentsArray
      argumentsArray.push(outputFile);
      // Start pdfmerge python process :O

      let pdfmergepy = spawn("py", argumentsArray);
      // log stdout data to the console
      pdfmergepy.stdout.on("data", data => {
        console.log(data.toString());
      });
      // If PyPDF2 is not found then throw error :-)
      // If 'path not found' on input then throw error ;-)
      pdfmergepy.stderr.on("data", data => {
        console.log("stderr", data.toString());
        if (data.toString().match("PdfFileWriter")) {
          error.code = 1;
          error.message =
            "PyPDF2 not found. Install PyPDF2, run pip3 install PyPDF2>=1.21";
        }
        if (data.toString().match("AssertionError: ERROR: path not found:")) {
          error.code = 404; // Why 404? cuz why not
          error.message = "Path not found. Please check input files.";
        }
      });
      // Success is code 0, Something other than 0 is not successful.
      pdfmergepy.on("close", code => {
        if (code === 0) {
          resolve("success");
        } else {
          reject(error);
        }
      });
      // If error, check for the code and log to console
      pdfmergepy.on("error", err => {
        console.log(err);
        if (err.message === "spawn py -3 ENOENT") {
          console.log("Please check if the PATH is correct!");
        }
      });
    });
  }
}

/**
 * ["C:\Users\z26izayi\Desktop\BibliotecaUNIR\app-downl…dist\resources\electron.asar\renderer\pdfmerge.py", "C:\Users\z26izayi\Desktop\BibliotecaUNIR\4143\3.pdf", "C:\Users\z26izayi\Desktop\BibliotecaUNIR\4143\4.pdf", "-o", "3-4.pdf"]
 */
