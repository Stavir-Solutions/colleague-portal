import boto3

def lambda_handler(event, context):
    # Function to start RDS DB instance
    start_rds_db = lambda db_instance_identifier: boto3.client('rds').start_db_instance(DBInstanceIdentifier=db_instance_identifier)

    # Example usage
    try:
        # Replace 'your-db-instance-identifier' with the actual identifier of your RDS DB instance
        db_instance_identifier = 'colleague-db'
        response = start_rds_db(db_instance_identifier)
        print("RDS DB instance starting:", response)
        return {
            'statusCode': 200,
            'body': "RDS DB instance starting: " + str(response)
        }
    except Exception as e:
        print("Error starting RDS DB instance:", e)
        return {
            'statusCode': 500,
            'body': "Error starting RDS DB instance: " + str(e)
        }
