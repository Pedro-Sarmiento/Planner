import os, logging

def conf_logging():
    if not os.path.exists('logs/'):
        os.makedirs('logs/') 

    logging.basicConfig(filename='logs/app.log', filemode='a', format='%(asctime)s %(levelname)s %(name)s : %(message)s', level=logging.INFO)
    logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)