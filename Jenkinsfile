pipeline {
	agent any

  environment {
    DESTINATION = "root@mterczynski.pl:/var/www/html/tetris-dom"
  }

	options {
		disableConcurrentBuilds()
	}

	stages {
		stage('Test') {
			steps {
				sh '''
					yarn test
				'''
			}
		}

		stage('Deploy') {
			steps {
				sh '''
					scp -r index.html ${DESTINATION}
					scp -r js ${DESTINATION}
					scp -r figures.css ${DESTINATION}
				'''
			}
		}
	}
}
