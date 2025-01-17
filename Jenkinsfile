pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Running build automation'
                sh './gradlew build --no-daemon'
                archiveArtifacts artifacts: 'dist/trainSchedule.zip'
            }
        }
        stage('DeployToStaging') {
            when {
                branch 'master'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'webserver_login', usernameVariable: 'USERNAME', passwordVariable: 'USERPASS')]) {
                    sshPublisher(
                        failOnError: true,
                        continueOnError: false,
                        publishers: [
                            sshPublisherDesc(
                                configName: 'staging',
                                sshCredentials: [
                                    username: "${USERNAME}",
                                    encryptedPassphrase: "${USERPASS}"
                                ], 
                                transfers: [
                                    sshTransfer(
                                        sourceFiles: 'dist/trainSchedule.zip',
                                        removePrefix: 'dist/',
                                        remoteDirectory: '/tmp',
                                        execCommand: '''
                                            # Extract the files
                                            sudo /usr/bin/systemctl stop train-schedule
                                            
                                            sudo rm -rf /opt/train-schedule/*
                                            sudo unzip /tmp/trainSchedule.zip -d /opt/train-schedule
                                            
                                            # Set correct permissions
                                            sudo chown -R cloud_user:cloud_user /opt/train-schedule
                                            sudo chmod -R 755 /opt/train-schedule

                                            # Restart the service
                                            sudo /usr/bin/systemctl start train-schedule
                                        '''
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
        }
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                input 'Does the staging environment look OK?'
                milestone(1)
                withCredentials([usernamePassword(credentialsId: 'webserver_login', usernameVariable: 'USERNAME', passwordVariable: 'USERPASS')]) {
                    sshPublisher(
                        failOnError: true,
                        continueOnError: false,
                        publishers: [
                            sshPublisherDesc(
                                configName: 'production',
                                sshCredentials: [
                                    username: "${USERNAME}",
                                    encryptedPassphrase: "${USERPASS}"
                                ], 
                                transfers: [
                                    sshTransfer(
                                        sourceFiles: 'dist/trainSchedule.zip',
                                        removePrefix: 'dist/',
                                        remoteDirectory: '/tmp',
                                        execCommand: '''
                                            # Extract the files
                                            sudo /usr/bin/systemctl stop train-schedule
                                            
                                            sudo rm -rf /opt/train-schedule/*
                                            sudo unzip /tmp/trainSchedule.zip -d /opt/train-schedule
                                            
                                            # Set correct permissions
                                            sudo chown -R cloud_user:cloud_user /opt/train-schedule
                                            sudo chmod -R 755 /opt/train-schedule

                                            # Restart the service
                                            sudo /usr/bin/systemctl start train-schedule
                                        '''
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
        }
    }
}
