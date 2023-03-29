import Head from 'next/head'
import {useCallback, useRef, useState} from "react";
import cn from 'classnames';
import {HttpPost} from "@/utils/http";

type Result = 'modified' | 'original';

const statusText: Record<Result, string> = {
    'modified': 'Modified',
    'original': 'Original'
};
export default function Home() {
    const [noImagesWereLoadedBefore, setNoImagesWereLoadedBefore] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleLoadPhotoButtonClick = useCallback(() => {
      fileInputRef.current?.click();
    }, [fileInputRef]);

    const onPhotoLoaded = (event: any) => {
        setUserImage(event.target.result);
        setNoImagesWereLoadedBefore(false);
    };

    const [userImage, setUserImage] = useState('');
    const handleUserPhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files.length) {
            return;
        }

        setResult(null);

        const file = files[0];
        let reader = new FileReader();
        reader.onload = onPhotoLoaded;
        reader.readAsDataURL(file);
    }, [onPhotoLoaded]);

    const photoLoaderPanelRef = useRef<HTMLDivElement>(null);
    const resultPanelRef = useRef<HTMLDivElement>(null);

    const [result, setResult] = useState<{
        isProcessing?: boolean,
        result?: string,
    } | null>(null);
    const handleCheckPhotoClick = useCallback(() => {
        setResult({
            isProcessing: true
        });

        let promise  = HttpPost('/check', JSON.stringify({'image': userImage}))

        promise.then(
            (response) => {
                let imageStatus: Result = JSON.parse(response as string).status;
                setResult({
                    isProcessing: false,
                    result: statusText[imageStatus],
                });
            },
            (error) => {
                // TODO: show smt meaningful
                setResult({
                    isProcessing: false,
                });
            }
        );
    }, [userImage]);

  return (
      <>
          <Head>
                <meta charSet='UTF-8' />
                <title>Photo detective</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Slab" />
          </Head>
          <main>
                <div ref={photoLoaderPanelRef} className={cn('loadPhotoPanel', {halfWidth: !noImagesWereLoadedBefore})}>
                  <h1>Photo Detective</h1>
                  <img className='photo-loader-panel__icon' src="/detective.png" alt='Detective icon' />
                    <button
                        className='photo-loader-panel__button'
                        onClick={handleLoadPhotoButtonClick}
                        disabled={result?.isProcessing}
                    >
                        Choose photo...
                    </button>
                    <input
                        ref={fileInputRef}
                        className='fileInput'
                        type="file"
                        accept=".jpg, .jpeg"
                        name="photo"
                        onChange={handleUserPhotoChange}
                    />
                </div>
                <div
                    ref={resultPanelRef}
                    className={cn('resultPanel', {halfWidth: !noImagesWereLoadedBefore})}
                >
                  <div className={cn('resultPanelContent', {invisible: noImagesWereLoadedBefore})}>
                    <div className='imageContainer'>
                      <img className='image' src={userImage} />
                    </div>
                    <div className='buttonResultContainer'>
                      <input
                          className={cn('checkButton', {
                              hidden: !userImage || result?.result,
                              loading: result?.isProcessing,
                          })}
                          type="button"
                          value="Check"
                          onClick={handleCheckPhotoClick}
                      />
                      <p className='resultText'>{result?.result}</p>
                    </div>
                  </div>
                </div>
          </main>
      </>
  );
}