https://github.com/OptimalBits/bull

Workflow:
	App server sends:
		a) JSON config file
		b) Job ID
	Send Back
		a) Update in app server stages
		b) Send report for analysis in app server


	Define API to submit jobs from App Server
	Implement function to explore filesystem
		shell.find('controllers').filter(function(file) { 

			if(file.match(/\.js$/)) {
				console.log( file.match(/\.js$/) )
			}
			
		})
	
	Execute command using shelljs
		const shell = require('shelljs')

		shell.exec('./test.sh', function(code, stdout, stderr) {
		  console.log('Exit code:', code);
		  console.log('Program output:', stdout);
		  console.log('Program stderr:', stderr);
		});
