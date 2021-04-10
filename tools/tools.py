import matplotlib.pyplot as plt


def plot_developement(squareN= 144000000, first_claim = 1440000, deg= 0.99, nClaims= 100,claimSplit= True, minimum_claim = 2):
    claims = []
    for x in range(nClaims): 
        claims.append(first_claim)
        first_claim = first_claim * deg
        if first_claim <= minimum_claim: 
            first_claim = minimum_claim
        if sum(claims) >= squareN: 
            nClaims = x+1
            print("All squares distributed before the max claims were reached!")
            print("Last claim: " + str(x))
            break
    print("Last claim amount: " + str(first_claim))
            
    X = list(range(0, nClaims))
    fig, axs = plt.subplots(1, 2, constrained_layout=True,figsize=(10,10))
    axs[0].bar(X,claims, width=1,align = "edge")
    axs[0].plot(X,claims,color="red")
    
    if claimSplit: 
        labels = 'First Ten', '10-100', '101-' + str(nClaims), 'Unclaimed'
        ten = sum(claims[:10]) / squareN
        hundred = sum(claims[10:100]) / squareN
        rest = sum(claims[100:]) / squareN
        remain = max(1-(ten+hundred+rest),0)
        sizes = [ten,hundred,rest, remain]
        explode = (0,0,0,0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
        
    else: 
        labels = 'claimed', 'Unclaimed'
        owned = sum(claims) / squareN

        sizes = [owned, 1-owned]
        explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
        
        
    axs[1].pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
            shadow=True, startangle=90)
    
    axs[1].axis('equal')  
    axs[0].set_title('Square shares')
    axs[0].set_xlabel('claim')
    axs[0].set_ylabel('Squares')
    fig.suptitle('degressive claim developement', fontsize=16)
    axs[1].set_title('unclaimed/claimed after ' + str(nClaims) + ' claims')
    plt.show()

def plot_developement_steps(squareN= 144000000, levels = [500,200,100],  nClaims=[500,200,10] ,claimSplit= True):
    claims = []
    for step in range(len(levels)): 
        for x in range(nClaims[step]): 
            claims.append(levels[step])
            if sum(claims) >= squareN: 
                nClaims = x+1
                print("All squares distributed before the max claims were reached!")
                print("Last claim: " + str(x))
                break
            
    X = list(range(0, sum(nClaims)))
    fig, axs = plt.subplots(1, 2, constrained_layout=True,figsize=(10,10))
    axs[0].bar(X,claims, width=1,align = "edge")
    axs[0].plot(X,claims,color="red")
    
    if claimSplit: 
        labels = 'First Ten', '10-100', '101-' + str(nClaims), 'Unclaimed'
        ten = sum(claims[:10]) / squareN
        hundred = sum(claims[10:100]) / squareN
        rest = sum(claims[100:]) / squareN
        remain = max(1-(ten+hundred+rest),0)
        sizes = [ten,hundred,rest, remain]
        explode = (0,0,0,0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
        
    else: 
        labels = 'claimed', 'Unclaimed'
        owned = sum(claims) / squareN

        sizes = [owned, 1-owned]
        explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
        
        
    axs[1].pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
            shadow=True, startangle=90)
    
    axs[1].axis('equal')  
    axs[0].set_title('Square shares')
    axs[0].set_xlabel('claim')
    axs[0].set_ylabel('Squares')
    fig.suptitle('degressive claim developement', fontsize=16)
    axs[1].set_title('unclaimed/claimed after ' + str(nClaims) + ' claims')
    plt.show()