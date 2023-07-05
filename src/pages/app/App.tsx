import {useCallback, useRef, useState} from "react";
import cn from 'classnames';

import styles from './App.module.css';
import {loadFile} from "@/utils/loadFile";

type Result = 'modified' | 'original';

const resultText: Record<Result, string> = {
    'modified': 'Modified',
    'original': 'Original'
};
export default function App() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFirstImage, setIsFirstImage] = useState(true);
    const [userImage, setUserImage] = useState<string>();
    const [result, setResult] = useState<{
        value?: string | null,
        isProcessing?: boolean,
    }>();

    const handleLoadPhotoButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, [fileInputRef]);

    const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files.length) {
            return;
        }

        loadFile(files[0], (event: ProgressEvent<FileReader>) => {
            setResult({
                value: null,
                isProcessing: false,
            });
            setUserImage(event.target?.result as string);
            if (isFirstImage) setIsFirstImage(false);
        });
    }, [isFirstImage]);

    const handleCheckPhotoClick = useCallback(async () => {
        setResult({
            isProcessing: true
        });

        try {
            const response = await fetch('/check', {
                method: "POST",
                body: JSON.stringify({'image': userImage})
            });
            const json = await response.json();

            let imageStatus: Result = json.status;
            setResult({
                isProcessing: false,
                value: resultText[imageStatus],
            });
        } catch (error) {
            setResult({
                isProcessing: false,
                value: 'Error',
            });
        }
    }, [userImage]);

  return (
          <div>
                <div className={cn(styles.loadPhotoBlock, {[styles.halfWidth]: !isFirstImage})}>
                  <h1>Photo Detective</h1>
                  <img className={styles.appIcon} src="/detective.png" alt='Detective icon' />
                    <button
                        className={styles.loadPhotoButton}
                        onClick={handleLoadPhotoButtonClick}
                        disabled={result?.isProcessing}
                    >
                        Choose photo...
                    </button>
                    <input
                        ref={fileInputRef}
                        className={styles.fileInput}
                        type="file"
                        accept=".jpg, .jpeg"
                        name="photo"
                        onChange={handlePhotoChange}
                    />
                </div>
                <div
                    className={cn(styles.resultBlock, {[styles.halfWidth]: !isFirstImage})}
                >
                  <div className={styles.resultContent}>
                    <div className={styles.userImageContainer}>
                      <img className={styles.userImage} src={userImage} />
                    </div>
                    <div className={styles.buttonResultContainer}>
                      <input
                          className={cn(styles.checkButton, {
                              [styles.hidden]: result?.value,
                              [styles.processing]: result?.isProcessing,
                          })}
                          type="button"
                          value="Check"
                          onClick={handleCheckPhotoClick}
                      />
                      <p className={styles.result}>{result?.value}</p>
                    </div>
                  </div>
                </div>
          </div>
  );
}
