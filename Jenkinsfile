// deprecated; todo - replace with deploy.sh file

pipeline {
	agent any

  environment {
    DESTINATION = "root@mterczynski.pl:/var/www/html/tetris"
  }

	options {
		disableConcurrentBuilds()
	}

	stages {
    stage('Install') {
			steps {
				sh '''
					yarn
				'''
			}
		}

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
